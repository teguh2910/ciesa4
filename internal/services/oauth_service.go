package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/sirupsen/logrus"

	"json-response-generator/internal/models"
)

// OAuthService handles OAuth 2.0 authentication for CEISA 4.0 API
type OAuthService struct {
	httpClient *http.Client
	tokenInfo  *models.OAuthTokenInfo
	config     *models.OAuth2Config
	mutex      sync.RWMutex
}

// NewOAuthService creates a new OAuth service instance
func NewOAuthService() *OAuthService {
	return &OAuthService{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// SetConfig sets the OAuth 2.0 configuration
func (os *OAuthService) SetConfig(config *models.OAuth2Config) {
	os.mutex.Lock()
	defer os.mutex.Unlock()
	os.config = config
}

// GetConfig returns the current OAuth 2.0 configuration
func (os *OAuthService) GetConfig() *models.OAuth2Config {
	os.mutex.RLock()
	defer os.mutex.RUnlock()
	return os.config
}

// Login performs OAuth 2.0 login and obtains access token
func (os *OAuthService) Login(username, password string) (*models.OAuthTokenInfo, error) {
	if os.config == nil {
		return nil, fmt.Errorf("OAuth 2.0 configuration not set")
	}

	// Prepare login request
	loginReq := models.OAuthLoginRequest{
		Username: username,
		Password: password,
	}

	jsonData, err := json.Marshal(loginReq)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal login request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", os.config.TokenURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create login request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "JSON-Response-Generator/2.0.0")

	logrus.WithFields(logrus.Fields{
		"endpoint": os.config.TokenURL,
		"username": username,
	}).Info("Attempting OAuth 2.0 login")

	// Send request
	resp, err := os.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("login request failed: %w", err)
	}
	defer resp.Body.Close()

	// Parse response
	var tokenResp models.OAuthTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, fmt.Errorf("failed to parse token response: %w", err)
	}

	// Check if login was successful
	if resp.StatusCode != http.StatusOK || tokenResp.Status != "success" {
		return nil, fmt.Errorf("login failed: %s (status: %d)", tokenResp.Message, resp.StatusCode)
	}

	// Calculate expiration time
	expiresAt := time.Now().Add(time.Duration(tokenResp.Item.ExpiresIn) * time.Second)

	// Create token info
	tokenInfo := &models.OAuthTokenInfo{
		AccessToken:  tokenResp.Item.AccessToken,
		RefreshToken: tokenResp.Item.RefreshToken,
		ExpiresAt:    expiresAt,
		TokenType:    tokenResp.Item.TokenType,
		Scope:        tokenResp.Item.Scope,
	}

	// Store token info
	os.mutex.Lock()
	os.tokenInfo = tokenInfo
	os.mutex.Unlock()

	logrus.WithFields(logrus.Fields{
		"expires_at": expiresAt,
		"token_type": tokenResp.Item.TokenType,
		"scope":      tokenResp.Item.Scope,
	}).Info("OAuth 2.0 login successful")

	return tokenInfo, nil
}

// RefreshToken refreshes the access token using refresh token
func (os *OAuthService) RefreshToken() (*models.OAuthTokenInfo, error) {
	if os.config == nil {
		return nil, fmt.Errorf("OAuth 2.0 configuration not set")
	}

	os.mutex.RLock()
	currentToken := os.tokenInfo
	os.mutex.RUnlock()

	if currentToken == nil || currentToken.RefreshToken == "" {
		return nil, fmt.Errorf("no refresh token available")
	}

	// Create refresh request
	req, err := http.NewRequest("POST", os.config.RefreshURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create refresh request: %w", err)
	}

	// Set headers with refresh token
	req.Header.Set("Authorization", currentToken.RefreshToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "JSON-Response-Generator/2.0.0")

	logrus.WithFields(logrus.Fields{
		"endpoint": os.config.RefreshURL,
	}).Info("Attempting token refresh")

	// Send request
	resp, err := os.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("refresh request failed: %w", err)
	}
	defer resp.Body.Close()

	// Parse response
	var tokenResp models.OAuthTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, fmt.Errorf("failed to parse refresh response: %w", err)
	}

	// Check if refresh was successful
	if resp.StatusCode != http.StatusOK || tokenResp.Status != "success" {
		return nil, fmt.Errorf("token refresh failed: %s (status: %d)", tokenResp.Message, resp.StatusCode)
	}

	// Calculate new expiration time
	expiresAt := time.Now().Add(time.Duration(tokenResp.Item.ExpiresIn) * time.Second)

	// Create new token info
	newTokenInfo := &models.OAuthTokenInfo{
		AccessToken:  tokenResp.Item.AccessToken,
		RefreshToken: tokenResp.Item.RefreshToken,
		ExpiresAt:    expiresAt,
		TokenType:    tokenResp.Item.TokenType,
		Scope:        tokenResp.Item.Scope,
	}

	// Store new token info
	os.mutex.Lock()
	os.tokenInfo = newTokenInfo
	os.mutex.Unlock()

	logrus.WithFields(logrus.Fields{
		"expires_at": expiresAt,
	}).Info("Token refresh successful")

	return newTokenInfo, nil
}

// GetValidToken returns a valid access token, refreshing if necessary
func (os *OAuthService) GetValidToken() (string, error) {
	os.mutex.RLock()
	currentToken := os.tokenInfo
	os.mutex.RUnlock()

	if currentToken == nil {
		return "", fmt.Errorf("no token available, please login first")
	}

	// Check if token is still valid (with 1 minute buffer)
	if time.Now().Add(1 * time.Minute).Before(currentToken.ExpiresAt) {
		return currentToken.AccessToken, nil
	}

	// Token is expired or about to expire, try to refresh
	logrus.Info("Access token expired or about to expire, attempting refresh")
	
	newToken, err := os.RefreshToken()
	if err != nil {
		return "", fmt.Errorf("failed to refresh token: %w", err)
	}

	return newToken.AccessToken, nil
}

// GetTokenInfo returns the current token information
func (os *OAuthService) GetTokenInfo() *models.OAuthTokenInfo {
	os.mutex.RLock()
	defer os.mutex.RUnlock()
	return os.tokenInfo
}

// IsTokenValid checks if the current token is valid
func (os *OAuthService) IsTokenValid() bool {
	os.mutex.RLock()
	defer os.mutex.RUnlock()

	if os.tokenInfo == nil {
		return false
	}

	return time.Now().Before(os.tokenInfo.ExpiresAt)
}

// ClearToken clears the stored token information
func (os *OAuthService) ClearToken() {
	os.mutex.Lock()
	defer os.mutex.Unlock()
	os.tokenInfo = nil
}

// ValidateConfig validates OAuth 2.0 configuration
func (os *OAuthService) ValidateConfig(config *models.OAuth2Config) error {
	if config.TokenURL == "" {
		return fmt.Errorf("token URL is required")
	}
	if config.RefreshURL == "" {
		return fmt.Errorf("refresh URL is required")
	}
	if config.Username == "" {
		return fmt.Errorf("username is required")
	}
	if config.Password == "" {
		return fmt.Errorf("password is required")
	}
	return nil
}

// GetDefaultConfig returns default OAuth 2.0 configuration for CEISA 4.0
func (os *OAuthService) GetDefaultConfig() *models.OAuth2Config {
	return &models.OAuth2Config{
		TokenURL:   "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login",
		RefreshURL: "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token",
		Username:   "",
		Password:   "",
	}
}
