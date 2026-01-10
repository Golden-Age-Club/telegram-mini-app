# Golden Age Club API Integration

This document describes the API integration for the Golden Age Club casino application.

## API Configuration

The application has been configured with the following Golden Age Club API settings:

### Product Information
- **Product Name**: Golden Age Club
- **Currency**: USDT
- **Demo Site**: https://pghome.co

### Server Configuration
- **Domain**: https://server-kl7c.onrender.com
- **Server IPs**: 
  - 74.220.48.0/24
  - 74.220.56.0/24
- **API Callback URL**: https://server-kl7c.onrender.com/api/callback

## Implementation Details

### 1. API Configuration (`src/config/api.js`)
Contains all API endpoints and configuration settings for the Golden Age Club integration.

### 2. API Service (`src/services/apiService.js`)
Handles all HTTP requests with:
- Automatic retry logic
- Error handling
- Timeout management
- Request/response logging

### 3. API Context (`src/contexts/ApiContext.jsx`)
React context that provides:
- Connection status
- User authentication
- Demo credentials management
- Game and wallet operations

### 4. API Status Component (`src/components/ApiStatus.jsx`)
Visual component showing:
- Connection status
- Configuration details
- Demo credentials status
- API testing capabilities

## Available API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration

### User Management
- `GET /api/user/profile/{userId}` - Get user profile
- `GET /api/user/balance/{userId}` - Get user balance
- `GET /api/user/transactions/{userId}` - Get transaction history

### Game Management
- `GET /api/games` - List available games
- `POST /api/game/start` - Start a game session
- `POST /api/game/end` - End a game session
- `GET /api/game/result/{gameId}` - Get game results

### Wallet Operations
- `POST /api/wallet/deposit` - Process deposit
- `POST /api/wallet/withdraw` - Process withdrawal
- `GET /api/wallet/history/{userId}` - Get wallet history

### Configuration
- `GET /api/demo` - Get demo credentials
- `GET /api/product/config` - Get product configuration
- `GET /api/config` - Get system configuration

## Usage

### 1. API Context Usage
```jsx
import { useApi } from './contexts/ApiContext';

function MyComponent() {
  const { 
    user, 
    isConnected, 
    demoCredentials, 
    login, 
    startGame, 
    deposit 
  } = useApi();
  
  // Use API methods...
}
```

### 2. Direct API Service Usage
```javascript
import { apiService } from './services/apiService';

// Make API calls
const result = await apiService.login({ username, password });
const balance = await apiService.getUserBalance(userId);
```

### 3. Testing API Connection
```javascript
import { testGoldenAgeApi } from './utils/apiTester';

// Test all endpoints
const results = await testGoldenAgeApi();
```

## Features

### 1. Automatic Demo Credential Detection
The system automatically tries to fetch demo credentials from various API endpoints:
- `/api/demo`
- `/api/demo-credentials`
- `/api/product/config`
- `/config`

### 2. Connection Status Monitoring
- Real-time connection status display
- Visual indicators in the UI
- Automatic retry mechanisms

### 3. Error Handling
- Graceful fallback to offline mode
- User-friendly error messages
- Detailed logging for debugging

### 4. API Testing Tools
- Built-in endpoint testing
- Credential discovery
- Connection diagnostics

## Testing

### 1. Browser Testing
- Open the application
- Click the WiFi icon in the top-right corner
- Use the "Test All Endpoints" button

### 2. Node.js Testing
```bash
node test-golden-age-api.js
```

### 3. Console Testing
```javascript
// In browser console
import('./src/utils/apiTester.js').then(({ testGoldenAgeApi }) => {
  testGoldenAgeApi();
});
```

## Configuration Files

### Main Configuration
- `src/config/api.js` - API endpoints and settings
- `src/services/apiService.js` - HTTP client service
- `src/contexts/ApiContext.jsx` - React context provider

### Testing Files
- `test-golden-age-api.js` - Node.js test script
- `src/utils/apiTester.js` - Browser-based testing utility
- `src/components/ApiStatus.jsx` - Visual API status component

## Integration Status

✅ **Completed**:
- API configuration setup
- Service layer implementation
- React context integration
- UI status indicators
- Testing utilities
- Error handling
- Retry mechanisms

⏳ **Pending**:
- Demo credentials retrieval (depends on API response)
- User authentication flow
- Game session management
- Wallet operations

## Troubleshooting

### Connection Issues
1. Check if the API server is running at `https://server-kl7c.onrender.com`
2. Verify network connectivity
3. Check browser console for detailed error messages

### Demo Credentials Not Found
1. Use the API testing tool to check all endpoints
2. Contact the backend team for credential information
3. Check the demo site at https://pghome.co for login details

### API Errors
1. Check the API Status component for detailed error information
2. Review browser console logs
3. Use the retry connection feature

## Next Steps

1. **Test API Connection**: Run the test script to verify connectivity
2. **Fetch Demo Credentials**: Use the testing tools to find demo login information
3. **Implement Authentication**: Complete the login flow once credentials are available
4. **Test Game Operations**: Verify game start/end functionality
5. **Test Wallet Operations**: Verify deposit/withdrawal functionality

## Support

For API-related issues:
1. Check the API Status component in the application
2. Run the test utilities to diagnose connection issues
3. Review the browser console for detailed error logs
4. Contact the Golden Age Club backend team for server-side issues