package services

import (
	"testing"
	"time"

	"json-response-generator/internal/models"
)

func TestNewOAuthService(t *testing.T) {
	service := NewOAuthService()
	if service == nil {
		t.Fatal("NewOAuthService() returned nil")
	}
	
	if service.httpClient == nil {
		t.Error("OAuth service should have an HTTP client")
	}
}

func TestOAuthServiceConfig(t *testing.T) {
	service := NewOAuthService()
	
	// Test initial config is nil
	if config := service.GetConfig(); config != nil {
		t.Error("Initial config should be nil")
	}
	
	// Test setting config
	testConfig := &models.OAuth2Config{
		TokenURL:   "https://example.com/token",
		RefreshURL: "https://example.com/refresh",
		Username:   "testuser",
		Password:   "testpass",
	}
	
	service.SetConfig(testConfig)
	
	// Test getting config
	retrievedConfig := service.GetConfig()
	if retrievedConfig == nil {
		t.Fatal("Config should not be nil after setting")
	}
	
	if retrievedConfig.TokenURL != testConfig.TokenURL {
		t.Errorf("Expected TokenURL %s, got %s", testConfig.TokenURL, retrievedConfig.TokenURL)
	}
	
	if retrievedConfig.Username != testConfig.Username {
		t.Errorf("Expected Username %s, got %s", testConfig.Username, retrievedConfig.Username)
	}
}

func TestValidateConfig(t *testing.T) {
	service := NewOAuthService()
	
	tests := []struct {
		name    string
		config  *models.OAuth2Config
		wantErr bool
	}{
		{
			name: "valid config",
			config: &models.OAuth2Config{
				TokenURL:   "https://example.com/token",
				RefreshURL: "https://example.com/refresh",
				Username:   "testuser",
				Password:   "testpass",
			},
			wantErr: false,
		},
		{
			name: "missing token URL",
			config: &models.OAuth2Config{
				RefreshURL: "https://example.com/refresh",
				Username:   "testuser",
				Password:   "testpass",
			},
			wantErr: true,
		},
		{
			name: "missing refresh URL",
			config: &models.OAuth2Config{
				TokenURL: "https://example.com/token",
				Username: "testuser",
				Password: "testpass",
			},
			wantErr: true,
		},
		{
			name: "missing username",
			config: &models.OAuth2Config{
				TokenURL:   "https://example.com/token",
				RefreshURL: "https://example.com/refresh",
				Password:   "testpass",
			},
			wantErr: true,
		},
		{
			name: "missing password",
			config: &models.OAuth2Config{
				TokenURL:   "https://example.com/token",
				RefreshURL: "https://example.com/refresh",
				Username:   "testuser",
			},
			wantErr: true,
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := service.ValidateConfig(tt.config)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateConfig() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestGetDefaultConfig(t *testing.T) {
	service := NewOAuthService()
	config := service.GetDefaultConfig()
	
	if config == nil {
		t.Fatal("GetDefaultConfig() returned nil")
	}
	
	expectedTokenURL := "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login"
	if config.TokenURL != expectedTokenURL {
		t.Errorf("Expected TokenURL %s, got %s", expectedTokenURL, config.TokenURL)
	}
	
	expectedRefreshURL := "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token"
	if config.RefreshURL != expectedRefreshURL {
		t.Errorf("Expected RefreshURL %s, got %s", expectedRefreshURL, config.RefreshURL)
	}
}

func TestTokenInfo(t *testing.T) {
	service := NewOAuthService()
	
	// Test initial token info is nil
	if tokenInfo := service.GetTokenInfo(); tokenInfo != nil {
		t.Error("Initial token info should be nil")
	}
	
	// Test initial token validity is false
	if service.IsTokenValid() {
		t.Error("Initial token should be invalid")
	}
	
	// Test clearing token (should not panic)
	service.ClearToken()
	
	if tokenInfo := service.GetTokenInfo(); tokenInfo != nil {
		t.Error("Token info should still be nil after clearing")
	}
}

func TestTokenValidation(t *testing.T) {
	service := NewOAuthService()
	
	// Create a mock token that's already expired
	expiredToken := &models.OAuthTokenInfo{
		AccessToken:  "expired_token",
		RefreshToken: "refresh_token",
		ExpiresAt:    time.Now().Add(-1 * time.Hour), // Expired 1 hour ago
		TokenType:    "Bearer",
		Scope:        "test",
	}
	
	// Manually set the expired token (for testing purposes)
	service.tokenInfo = expiredToken
	
	// Test that expired token is invalid
	if service.IsTokenValid() {
		t.Error("Expired token should be invalid")
	}
	
	// Create a valid token
	validToken := &models.OAuthTokenInfo{
		AccessToken:  "valid_token",
		RefreshToken: "refresh_token",
		ExpiresAt:    time.Now().Add(1 * time.Hour), // Expires in 1 hour
		TokenType:    "Bearer",
		Scope:        "test",
	}
	
	// Set the valid token
	service.tokenInfo = validToken
	
	// Test that valid token is valid
	if !service.IsTokenValid() {
		t.Error("Valid token should be valid")
	}
}

func TestGetValidTokenWithoutLogin(t *testing.T) {
	service := NewOAuthService()
	
	// Test getting valid token without login should fail
	_, err := service.GetValidToken()
	if err == nil {
		t.Error("GetValidToken() should fail when no token is available")
	}
	
	expectedError := "no token available, please login first"
	if err.Error() != expectedError {
		t.Errorf("Expected error %s, got %s", expectedError, err.Error())
	}
}

func TestConcurrentAccess(t *testing.T) {
	service := NewOAuthService()
	
	// Test concurrent access to config
	done := make(chan bool, 2)
	
	go func() {
		for i := 0; i < 100; i++ {
			config := &models.OAuth2Config{
				TokenURL:   "https://example.com/token",
				RefreshURL: "https://example.com/refresh",
				Username:   "testuser",
				Password:   "testpass",
			}
			service.SetConfig(config)
		}
		done <- true
	}()
	
	go func() {
		for i := 0; i < 100; i++ {
			_ = service.GetConfig()
		}
		done <- true
	}()
	
	// Wait for both goroutines to complete
	<-done
	<-done
	
	// Test should complete without race conditions
	if config := service.GetConfig(); config == nil {
		t.Error("Config should not be nil after concurrent access")
	}
}
