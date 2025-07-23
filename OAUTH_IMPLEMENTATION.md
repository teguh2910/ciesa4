# OAuth 2.0 Implementation for CEISA 4.0 API

This document describes the OAuth 2.0 authentication implementation for the Indonesian customs/import API (CEISA 4.0) in the JSON Response Generator application.

## Overview

The application now supports OAuth 2.0 authentication as specified in the CEISA 4.0 API documentation, implementing the Client Credentials Grant flow with access tokens and refresh tokens.

## Features

### Backend (Go)

#### OAuth Service (`internal/services/oauth_service.go`)
- **Token Management**: Handles access token and refresh token lifecycle
- **Automatic Refresh**: Automatically refreshes tokens when they expire
- **Thread-Safe**: Uses mutex for concurrent access protection
- **Configuration Validation**: Validates OAuth 2.0 configuration parameters

#### API Client Integration (`internal/services/api_client.go`)
- **Bearer Token Authentication**: Automatically adds Bearer tokens to API requests
- **Multiple Auth Types**: Supports OAuth 2.0, API Key, Basic Auth, and No Auth
- **Token Refresh**: Automatically refreshes expired tokens during API calls

#### HTTP Handlers (`internal/handlers/handlers.go`)
- `POST /api/oauth/login` - OAuth 2.0 login
- `POST /api/oauth/refresh` - Token refresh
- `GET /api/oauth/status` - Token status check
- `GET/POST /api/oauth/config` - OAuth configuration management
- `POST /api/oauth/logout` - Clear stored tokens

#### Data Models (`internal/models/models.go`)
- `OAuthTokenResponse` - CEISA 4.0 API token response structure
- `OAuthTokenInfo` - Internal token information storage
- `OAuth2Config` - OAuth 2.0 configuration parameters
- `ApiConfig` - Extended API configuration with OAuth support

### Frontend (Next.js/React)

#### OAuth Hooks (`frontend/src/hooks/useOAuth.ts`)
- `useOAuth()` - Main OAuth authentication hook
- `useOAuthConfig()` - OAuth configuration management hook
- **Automatic Token Refresh**: Monitors token expiration and refreshes automatically
- **Secure Storage**: Uses localStorage for token persistence
- **Error Handling**: Comprehensive error handling and user feedback

#### OAuth Components
- `OAuthConfig.tsx` - OAuth configuration and status management
- `OAuthLogin.tsx` - Login form and compact login widget
- **Tab Interface**: Integrated into API configuration page

#### API Client (`frontend/src/lib/api.ts`)
- OAuth 2.0 API methods for login, refresh, status, and configuration
- TypeScript type definitions for OAuth data structures

## Usage

### 1. Configure OAuth 2.0

Navigate to the API Configuration page and select the "OAuth 2.0 (CEISA 4.0)" tab:

```typescript
// Default CEISA 4.0 endpoints
const config = {
  token_url: "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login",
  refresh_url: "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token",
  username: "your_ceisa_username",
  password: "your_ceisa_password"
};
```

### 2. Login

Use the OAuth login component or API:

```typescript
const { login, isAuthenticated } = useOAuth();

const handleLogin = async () => {
  const success = await login({
    username: "your_username",
    password: "your_password"
  });
  
  if (success) {
    console.log("Login successful!");
  }
};
```

### 3. API Requests with OAuth

Configure your API requests to use OAuth 2.0:

```typescript
const apiConfig = {
  endpoint: "https://your-api-endpoint.com",
  auth_type: "oauth2",
  oauth2_config: {
    token_url: "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login",
    refresh_url: "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token",
    username: "your_username",
    password: "your_password"
  }
};

// Send data with OAuth authentication
await apiClient.sendToApi(jsonData, apiConfig);
```

### 4. Token Management

The system automatically handles token refresh:

```typescript
const { status, refresh } = useOAuth();

// Check token status
console.log("Authenticated:", status?.authenticated);
console.log("Time left:", status?.time_left, "seconds");

// Manual refresh
await refresh();
```

## Security Features

### Token Storage
- **Frontend**: Secure localStorage with automatic cleanup
- **Backend**: In-memory storage with thread-safe access
- **Expiration Handling**: Automatic token refresh before expiration

### Error Handling
- **Invalid Credentials**: Clear error messages for authentication failures
- **Token Expiration**: Automatic refresh with fallback to re-authentication
- **Network Errors**: Graceful handling of network connectivity issues

### Configuration Validation
- **Required Fields**: Validates all required OAuth parameters
- **URL Validation**: Ensures valid endpoint URLs
- **Credential Security**: Passwords are not exposed in API responses

## API Endpoints

### OAuth Login
```http
POST /api/oauth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

### Token Refresh
```http
POST /api/oauth/refresh
Authorization: Bearer <refresh_token>
```

### Token Status
```http
GET /api/oauth/status
```

### Configuration
```http
GET /api/oauth/config
POST /api/oauth/config
Content-Type: application/json

{
  "token_url": "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/login",
  "refresh_url": "https://apis-gw.beacukai.go.id/nle-oauth/v1/user/update-token",
  "username": "your_username",
  "password": "your_password"
}
```

## Testing

### Manual Testing
1. Start the application: `make run` (backend) and `npm run dev` (frontend)
2. Navigate to `/api-config` and select the OAuth 2.0 tab
3. Configure your CEISA 4.0 credentials
4. Test login functionality
5. Verify token status and automatic refresh

### API Testing
```bash
# Test OAuth login
curl -X POST http://localhost:5001/api/oauth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Test token status
curl http://localhost:5001/api/oauth/status
```

## Error Handling

Common error scenarios and their handling:

1. **Invalid Credentials**: Returns 401 with clear error message
2. **Token Expired**: Automatically attempts refresh
3. **Refresh Failed**: Prompts user to re-authenticate
4. **Network Error**: Displays connection error with retry option
5. **Configuration Error**: Validates and shows specific validation errors

## Integration with Existing Features

The OAuth 2.0 implementation integrates seamlessly with existing features:

- **Excel Upload**: OAuth tokens are used for API submissions
- **Manual Input**: Form data can be sent using OAuth authentication
- **API Testing**: Connection tests support OAuth endpoints
- **Configuration**: OAuth settings are persisted alongside other API settings

## Future Enhancements

Potential improvements for future versions:

1. **Token Encryption**: Encrypt stored tokens for additional security
2. **Multiple Accounts**: Support for multiple OAuth accounts
3. **SSO Integration**: Single Sign-On with enterprise systems
4. **Audit Logging**: Detailed logging of authentication events
5. **Token Revocation**: Explicit token revocation on logout

## Troubleshooting

### Common Issues

1. **Login Fails**: Verify CEISA 4.0 credentials and network connectivity
2. **Token Refresh Fails**: Check refresh token validity and endpoint availability
3. **API Calls Fail**: Ensure OAuth configuration is set and tokens are valid
4. **Configuration Not Saved**: Check browser localStorage and API connectivity

### Debug Information

Enable debug logging to troubleshoot issues:

```bash
# Backend debug logs
DEBUG=true go run main.go

# Frontend debug (browser console)
localStorage.setItem('debug', 'oauth:*');
```

This implementation provides a robust, secure, and user-friendly OAuth 2.0 authentication system for the CEISA 4.0 API integration.
