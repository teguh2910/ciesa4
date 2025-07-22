package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"json-response-generator/internal/models"
	"json-response-generator/internal/services"
)

func setupTestRouter() (*gin.Engine, *Handlers) {
	gin.SetMode(gin.TestMode)
	
	// Initialize services
	jsonGenerator := services.NewJsonGenerator()
	excelHandler := services.NewExcelHandler()
	apiClient := services.NewApiClient()
	
	// Initialize handlers
	h := New(jsonGenerator, excelHandler, apiClient)
	
	// Setup router
	router := gin.New()
	
	return router, h
}

func TestHealthCheck(t *testing.T) {
	router, h := setupTestRouter()
	router.GET("/api/health", h.HealthCheck)

	req, _ := http.NewRequest("GET", "/api/health", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// Check health response data
	healthData, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Equal(t, "healthy", healthData["status"])
	assert.Equal(t, "JSON Response Generator API", healthData["service"])
	assert.Equal(t, "2.0.0", healthData["version"])
}

func TestGetConfig(t *testing.T) {
	router, h := setupTestRouter()
	router.GET("/api/config", h.GetConfig)

	req, _ := http.NewRequest("GET", "/api/config", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// Check config data structure
	configData, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, configData, "api_endpoint")
	assert.Contains(t, configData, "api_timeout")
	assert.Contains(t, configData, "max_file_size")
}

func TestGenerateJson(t *testing.T) {
	router, h := setupTestRouter()
	router.POST("/api/generate-json", h.GenerateJson)

	// Test data
	testData := map[string]interface{}{
		"asalData":     "S",
		"disclaimer":   "1",
		"flagVd":       "Y",
		"idPengguna":   "TEST_USER",
		"cif":          1000000.0,
		"bruto":        100.0,
		"netto":        95.0,
		"barang":       []interface{}{},
		"entitas":      []interface{}{},
		"kemasan":      []interface{}{},
		"kontainer":    []interface{}{},
		"dokumen":      []interface{}{},
		"pengangkut":   []interface{}{},
	}

	requestBody := models.GenerateJsonRequest{
		Data: testData,
	}

	jsonData, _ := json.Marshal(requestBody)
	req, _ := http.NewRequest("POST", "/api/generate-json", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// Check response data structure
	responseData, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, responseData, "json_data")
	assert.Contains(t, responseData, "json_string")
}

func TestGetSampleData(t *testing.T) {
	router, h := setupTestRouter()
	router.GET("/api/sample-data", h.GetSampleData)

	req, _ := http.NewRequest("GET", "/api/sample-data", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// Check sample data structure
	responseData, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, responseData, "data")
	assert.Contains(t, responseData, "json_string")

	// Verify the sample data contains required fields
	sampleData, ok := responseData["data"].(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, sampleData, "asalData")
	assert.Contains(t, sampleData, "barang")
	assert.Contains(t, sampleData, "entitas")
}

func TestTestConnection(t *testing.T) {
	router, h := setupTestRouter()
	router.POST("/api/test-connection", h.TestConnection)

	// Test with invalid endpoint
	requestBody := models.TestConnectionRequest{
		Endpoint: "invalid-url",
	}

	jsonData, _ := json.Marshal(requestBody)
	req, _ := http.NewRequest("POST", "/api/test-connection", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	
	// Should return response even if connection fails
	responseData, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, responseData, "endpoint")
	assert.Contains(t, responseData, "message")
}
