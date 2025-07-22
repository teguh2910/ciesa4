package config

import (
	"os"
	"strconv"
)

// Config holds the application configuration
type Config struct {
	// Server configuration
	Host        string
	Port        string
	Debug       bool
	FrontendURL string

	// File upload configuration
	MaxFileSize int64 // in bytes

	// API configuration
	APIEndpoint string
	APIKey      string
	APIUsername string
	APIPassword string
	APITimeout  int
}

// AppConfig represents the configuration returned to the frontend
type AppConfig struct {
	APIEndpoint string `json:"api_endpoint"`
	APITimeout  int    `json:"api_timeout"`
	HasAPIKey   bool   `json:"has_api_key"`
	HasUsername bool   `json:"has_username"`
	HasPassword bool   `json:"has_password"`
	MaxFileSize int64  `json:"max_file_size"`
}

// Load loads configuration from environment variables
func Load() *Config {
	return &Config{
		Host:        getEnv("HOST", "127.0.0.1"),
		Port:        getEnv("PORT", "5001"),
		Debug:       getEnvBool("DEBUG", true),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),

		MaxFileSize: getEnvInt64("MAX_FILE_SIZE", 16*1024*1024), // 16MB

		APIEndpoint: getEnv("API_ENDPOINT", ""),
		APIKey:      getEnv("API_KEY", ""),
		APIUsername: getEnv("API_USERNAME", ""),
		APIPassword: getEnv("API_PASSWORD", ""),
		APITimeout:  getEnvInt("API_TIMEOUT", 30),
	}
}

// ToAppConfig converts Config to AppConfig for frontend consumption
func (c *Config) ToAppConfig() *AppConfig {
	return &AppConfig{
		APIEndpoint: c.APIEndpoint,
		APITimeout:  c.APITimeout,
		HasAPIKey:   c.APIKey != "",
		HasUsername: c.APIUsername != "",
		HasPassword: c.APIPassword != "",
		MaxFileSize: c.MaxFileSize,
	}
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.ParseBool(value); err == nil {
			return parsed
		}
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.Atoi(value); err == nil {
			return parsed
		}
	}
	return defaultValue
}

func getEnvInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.ParseInt(value, 10, 64); err == nil {
			return parsed
		}
	}
	return defaultValue
}
