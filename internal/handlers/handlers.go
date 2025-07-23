package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"json-response-generator/internal/config"
	"json-response-generator/internal/middleware"
	"json-response-generator/internal/models"
	"json-response-generator/internal/services"
)

// Handlers contains all the HTTP handlers
type Handlers struct {
	jsonGenerator *services.JsonGenerator
	excelHandler  *services.ExcelHandler
	apiClient     *services.ApiClient
	config        *config.Config
}

// New creates a new Handlers instance
func New(jsonGenerator *services.JsonGenerator, excelHandler *services.ExcelHandler, apiClient *services.ApiClient) *Handlers {
	return &Handlers{
		jsonGenerator: jsonGenerator,
		excelHandler:  excelHandler,
		apiClient:     apiClient,
		config:        config.Load(),
	}
}

// HealthCheck handles the health check endpoint
func (h *Handlers) HealthCheck(c *gin.Context) {
	response := models.HealthResponse{
		Status:    "healthy",
		Service:   "JSON Response Generator API",
		Version:   "2.0.0",
		Timestamp: time.Now(),
	}

	middleware.HandleSuccess(c, response)
}

// GetConfig handles the configuration endpoint
func (h *Handlers) GetConfig(c *gin.Context) {
	appConfig := h.config.ToAppConfig()
	middleware.HandleSuccess(c, appConfig)
}

// UploadExcel handles Excel file upload and processing
func (h *Handlers) UploadExcel(c *gin.Context) {
	// Parse multipart form
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		middleware.HandleError(c, http.StatusBadRequest, "No file uploaded", err)
		return
	}
	defer file.Close()

	// Validate file
	if header.Filename == "" {
		middleware.HandleError(c, http.StatusBadRequest, "No file selected", nil)
		return
	}

	// Check file extension
	ext := filepath.Ext(header.Filename)
	if ext != ".xlsx" && ext != ".xls" {
		middleware.HandleError(c, http.StatusBadRequest, "Invalid file format. Please upload .xlsx or .xls files only.", nil)
		return
	}

	// Check file size
	if header.Size > h.config.MaxFileSize {
		middleware.HandleError(c, http.StatusBadRequest, fmt.Sprintf("File too large. Maximum size is %d MB.", h.config.MaxFileSize/(1024*1024)), nil)
		return
	}

	// Save uploaded file temporarily
	tempFile, err := h.saveUploadedFile(file, header)
	if err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to save uploaded file", err)
		return
	}
	defer os.Remove(tempFile) // Clean up

	// Parse Excel file
	excelData, err := h.excelHandler.ParseExcelFile(tempFile)
	if err != nil {
		logrus.WithError(err).Error("Excel parsing failed")
		middleware.HandleError(c, http.StatusBadRequest, fmt.Sprintf("Error processing file: %v", err), err)
		return
	}

	// Return success response
	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data:    excelData,
		Message: "Excel file processed successfully",
	})
}

// DownloadTemplate handles Excel template download
func (h *Handlers) DownloadTemplate(c *gin.Context) {
	templatePath, err := h.excelHandler.GenerateTemplate()
	if err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to generate template", err)
		return
	}
	defer os.Remove(templatePath) // Clean up after sending

	// Set headers for file download
	fileName := fmt.Sprintf("customs_data_template_%s.xlsx", time.Now().Format("20060102"))
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

	// Send file
	c.File(templatePath)
}

// GenerateJson handles JSON generation from form data or Excel data
func (h *Handlers) GenerateJson(c *gin.Context) {
	var request models.GenerateJsonRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		middleware.HandleError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	// Convert request data to map
	dataMap, ok := request.Data.(map[string]interface{})
	if !ok {
		middleware.HandleError(c, http.StatusBadRequest, "Invalid data format", nil)
		return
	}

	// Generate ResponseData from input
	responseData, err := h.jsonGenerator.GenerateFromData(dataMap)
	if err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to generate response data", err)
		return
	}

	// Generate JSON string
	jsonString, err := h.jsonGenerator.GenerateJsonString(responseData)
	if err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to generate JSON string", err)
		return
	}

	// Parse JSON string back to object for response
	var jsonData interface{}
	if err := json.Unmarshal([]byte(jsonString), &jsonData); err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to parse generated JSON", err)
		return
	}

	// Return success response
	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data: map[string]interface{}{
			"json_data":   jsonData,
			"json_string": jsonString,
		},
	})
}

// TestConnection handles API connection testing
func (h *Handlers) TestConnection(c *gin.Context) {
	var request models.TestConnectionRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		middleware.HandleError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	endpoint := request.Endpoint
	if endpoint == "" {
		endpoint = h.config.APIEndpoint
	}

	if endpoint == "" {
		middleware.HandleError(c, http.StatusBadRequest, "No endpoint provided", nil)
		return
	}

	// Test connection
	success, message, err := h.apiClient.TestConnection(endpoint)
	if err != nil {
		logrus.WithError(err).Error("Connection test failed")
	}

	// Return response
	c.JSON(http.StatusOK, models.ApiResponse{
		Success: success,
		Data: map[string]interface{}{
			"endpoint": endpoint,
			"message":  message,
		},
	})
}

// SendToApi handles sending data to external API
func (h *Handlers) SendToApi(c *gin.Context) {
	var request models.SendToApiRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		middleware.HandleError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	// Use provided config or default
	apiConfig := request.ApiConfig
	if apiConfig == nil {
		apiConfig = &models.ApiConfig{
			Endpoint: h.config.APIEndpoint,
			APIKey:   h.config.APIKey,
			Username: h.config.APIUsername,
			Password: h.config.APIPassword,
			Timeout:  h.config.APITimeout,
		}
	}

	// Validate config
	if err := h.apiClient.ValidateConfig(apiConfig); err != nil {
		middleware.HandleError(c, http.StatusBadRequest, "Invalid API configuration", err)
		return
	}

	// Send data
	success, response, err := h.apiClient.SendData(&request.JsonData, apiConfig, request.DryRun)
	if err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to send data to API", err)
		return
	}

	// Return response
	c.JSON(http.StatusOK, models.ApiResponse{
		Success: success,
		Data: map[string]interface{}{
			"response": response,
			"dry_run":  request.DryRun,
		},
	})
}

// GetSampleData handles sample data generation
func (h *Handlers) GetSampleData(c *gin.Context) {
	// Generate sample data
	sampleData := h.jsonGenerator.GenerateSampleData()

	// Generate JSON string
	jsonString, err := h.jsonGenerator.GenerateJsonString(sampleData)
	if err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to generate JSON string", err)
		return
	}

	// Parse JSON string back to object for response
	var jsonData interface{}
	if err := json.Unmarshal([]byte(jsonString), &jsonData); err != nil {
		middleware.HandleError(c, http.StatusInternalServerError, "Failed to parse generated JSON", err)
		return
	}

	// Return success response
	c.JSON(http.StatusOK, models.ApiResponse{
		Success: true,
		Data: map[string]interface{}{
			"data":        jsonData,
			"json_string": jsonString,
		},
	})
}

// saveUploadedFile saves the uploaded file to a temporary location
func (h *Handlers) saveUploadedFile(file multipart.File, header *multipart.FileHeader) (string, error) {
	// Use app temp directory instead of /tmp to avoid Alpine Linux issues
	tempDir := "/app/temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create temp directory %s: %w", tempDir, err)
	}

	// Create temporary file in the specific directory
	tempFile, err := os.CreateTemp(tempDir, "upload_*.xlsx")
	if err != nil {
		return "", fmt.Errorf("failed to create temporary file in %s: %w", tempDir, err)
	}
	defer tempFile.Close()

	// Copy uploaded file to temporary file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		os.Remove(tempFile.Name())
		return "", fmt.Errorf("failed to save file %s: %w", tempFile.Name(), err)
	}

	return tempFile.Name(), nil
}
