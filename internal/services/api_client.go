package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/sirupsen/logrus"

	"json-response-generator/internal/models"
)

// ApiClient service for sending data to external APIs
type ApiClient struct {
	httpClient   *http.Client
	oauthService *OAuthService
}

// NewApiClient creates a new ApiClient instance
func NewApiClient() *ApiClient {
	return &ApiClient{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		oauthService: NewOAuthService(),
	}
}

// NewApiClientWithOAuth creates a new ApiClient instance with OAuth service
func NewApiClientWithOAuth(oauthService *OAuthService) *ApiClient {
	return &ApiClient{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		oauthService: oauthService,
	}
}

// TestConnection tests the connection to an API endpoint
func (ac *ApiClient) TestConnection(endpoint string) (bool, string, error) {
	if endpoint == "" {
		return false, "Endpoint URL is required", nil
	}

	// Create a simple GET request to test connectivity
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return false, fmt.Sprintf("Failed to create request: %v", err), err
	}

	// Set headers
	req.Header.Set("User-Agent", "JSON-Response-Generator/2.0.0")
	req.Header.Set("Accept", "application/json")

	// Send request
	resp, err := ac.httpClient.Do(req)
	if err != nil {
		return false, fmt.Sprintf("Connection failed: %v", err), err
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return true, fmt.Sprintf("Connection successful (Status: %d)", resp.StatusCode), nil
	} else {
		return false, fmt.Sprintf("Server responded with status: %d", resp.StatusCode), nil
	}
}

// SendData sends JSON data to the API endpoint
func (ac *ApiClient) SendData(data *models.ResponseData, config *models.ApiConfig, dryRun bool) (bool, map[string]interface{}, error) {
	if dryRun {
		logrus.Info("Dry run mode - data would be sent to:", config.Endpoint)
		return true, map[string]interface{}{
			"message":   "Dry run completed - no data was actually sent",
			"endpoint":  config.Endpoint,
			"data_size": fmt.Sprintf("%d bytes", len(fmt.Sprintf("%+v", data))),
		}, nil
	}

	if config.Endpoint == "" {
		return false, nil, fmt.Errorf("API endpoint is required")
	}

	// Marshal data to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return false, nil, fmt.Errorf("failed to marshal data: %w", err)
	}

	// Create request
	req, err := http.NewRequest("POST", config.Endpoint, bytes.NewBuffer(jsonData))
	if err != nil {
		return false, nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "JSON-Response-Generator/2.0.0")

	// Add authentication based on auth type
	switch config.AuthType {
	case "api_key":
		if config.APIKey != "" {
			req.Header.Set("X-API-Key", config.APIKey)
		}
	case "basic":
		if config.Username != "" && config.Password != "" {
			req.SetBasicAuth(config.Username, config.Password)
		}
	case "oauth2":
		if config.OAuth2Config != nil {
			// Set OAuth configuration if provided
			ac.oauthService.SetConfig(config.OAuth2Config)

			// Get valid access token
			accessToken, err := ac.oauthService.GetValidToken()
			if err != nil {
				return false, nil, fmt.Errorf("failed to get valid OAuth token: %w", err)
			}

			req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
		}
	default:
		// Legacy support for backward compatibility
		if config.APIKey != "" {
			req.Header.Set("X-API-Key", config.APIKey)
		}
		if config.Username != "" && config.Password != "" {
			req.SetBasicAuth(config.Username, config.Password)
		}
	}

	// Set timeout if specified
	if config.Timeout > 0 {
		ac.httpClient.Timeout = time.Duration(config.Timeout) * time.Second
	}

	logrus.WithFields(logrus.Fields{
		"endpoint": config.Endpoint,
		"method":   "POST",
		"size":     len(jsonData),
	}).Info("Sending data to API")

	// Send request
	resp, err := ac.httpClient.Do(req)
	if err != nil {
		return false, nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Parse response
	var responseData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&responseData); err != nil {
		// If JSON parsing fails, create a simple response
		responseData = map[string]interface{}{
			"status_code": resp.StatusCode,
			"status":      resp.Status,
		}
	}

	// Check if request was successful
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		logrus.WithFields(logrus.Fields{
			"endpoint":    config.Endpoint,
			"status_code": resp.StatusCode,
		}).Info("Data sent successfully")

		responseData["success"] = true
		responseData["status_code"] = resp.StatusCode
		return true, responseData, nil
	} else {
		logrus.WithFields(logrus.Fields{
			"endpoint":    config.Endpoint,
			"status_code": resp.StatusCode,
			"status":      resp.Status,
		}).Error("API request failed")

		responseData["success"] = false
		responseData["status_code"] = resp.StatusCode
		responseData["error"] = fmt.Sprintf("API request failed with status: %s", resp.Status)
		return false, responseData, nil
	}
}

// ValidateConfig validates API configuration
func (ac *ApiClient) ValidateConfig(config *models.ApiConfig) error {
	if config.Endpoint == "" {
		return fmt.Errorf("API endpoint is required")
	}

	if config.Timeout < 0 {
		return fmt.Errorf("timeout must be positive")
	}

	if config.Timeout == 0 {
		config.Timeout = 30 // Default timeout
	}

	return nil
}

// GetDefaultConfig returns default API configuration
func (ac *ApiClient) GetDefaultConfig() *models.ApiConfig {
	return &models.ApiConfig{
		Endpoint: "",
		APIKey:   "",
		Username: "",
		Password: "",
		Timeout:  30,
		AuthType: "none",
	}
}

// OAuth 2.0 specific methods

// SetOAuthConfig sets the OAuth 2.0 configuration
func (ac *ApiClient) SetOAuthConfig(config *models.OAuth2Config) {
	ac.oauthService.SetConfig(config)
}

// GetOAuthConfig returns the current OAuth 2.0 configuration
func (ac *ApiClient) GetOAuthConfig() *models.OAuth2Config {
	return ac.oauthService.GetConfig()
}

// OAuthLogin performs OAuth 2.0 login
func (ac *ApiClient) OAuthLogin(username, password string) (*models.OAuthTokenInfo, error) {
	return ac.oauthService.Login(username, password)
}

// OAuthRefresh refreshes the OAuth 2.0 token
func (ac *ApiClient) OAuthRefresh() (*models.OAuthTokenInfo, error) {
	return ac.oauthService.RefreshToken()
}

// GetOAuthTokenInfo returns the current OAuth token information
func (ac *ApiClient) GetOAuthTokenInfo() *models.OAuthTokenInfo {
	return ac.oauthService.GetTokenInfo()
}

// IsOAuthTokenValid checks if the current OAuth token is valid
func (ac *ApiClient) IsOAuthTokenValid() bool {
	return ac.oauthService.IsTokenValid()
}

// ClearOAuthToken clears the stored OAuth token
func (ac *ApiClient) ClearOAuthToken() {
	ac.oauthService.ClearToken()
}
