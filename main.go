package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"

	"json-response-generator/internal/config"
	"json-response-generator/internal/handlers"
	"json-response-generator/internal/middleware"
	"json-response-generator/internal/services"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found, using environment variables")
	}

	// Initialize configuration
	cfg := config.Load()

	// Setup logging
	setupLogging(cfg.Debug)

	// Initialize services
	jsonGenerator := services.NewJsonGenerator()
	excelHandler := services.NewExcelHandler()
	apiClient := services.NewApiClient()

	// Initialize handlers
	h := handlers.New(jsonGenerator, excelHandler, apiClient)

	// Setup Gin router
	if !cfg.Debug {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.ErrorHandler())

	// CORS configuration
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		cfg.FrontendURL,
	}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	corsConfig.AllowCredentials = true
	router.Use(cors.New(corsConfig))

	// API routes
	api := router.Group("/api")
	{
		// Health check
		api.GET("/health", h.HealthCheck)

		// Configuration
		api.GET("/config", h.GetConfig)

		// Excel operations
		api.POST("/upload-excel", h.UploadExcel)
		api.GET("/download-template", h.DownloadTemplate)

		// JSON generation
		api.POST("/generate-json", h.GenerateJson)

		// API operations
		api.POST("/test-connection", h.TestConnection)
		api.POST("/send-to-api", h.SendToApi)

		// Sample data
		api.GET("/sample-data", h.GetSampleData)
	}

	// Start server
	addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	logrus.Infof("🚀 Starting JSON Response Generator API Server...")
	logrus.Infof("📡 API available at: http://%s", addr)
	logrus.Infof("🔧 Debug mode: %v", cfg.Debug)
	logrus.Infof("🌐 CORS enabled for: %s", cfg.FrontendURL)

	if err := router.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func setupLogging(debug bool) {
	logrus.SetFormatter(&logrus.JSONFormatter{})
	
	if debug {
		logrus.SetLevel(logrus.DebugLevel)
	} else {
		logrus.SetLevel(logrus.InfoLevel)
	}

	logrus.SetOutput(os.Stdout)
}
