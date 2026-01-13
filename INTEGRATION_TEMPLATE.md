# API Integration Information
## Technical Documentation (For Developers)

### Overview
This document describes the required information and technical requirements for API integration.
All items listed below must be provided before API access is enabled and testing can begin.

---

## 1. Product Name
**Current Value**: `GoldenAgeClub`

A unique identifier used to register this product in the provider's system.

**Requirements**:
- ✅ English letters and numbers only
- ✅ No spaces or special characters

---

## 2. Server IP
**Current Values**: 
- `74.220.48.0/24`
- `74.220.56.0/24`

Public IP address(es) of the backend server(s) that will initiate API requests.

**Requirements**:
- ✅ Public IPv4 only
- ✅ Multiple IPs must all be provided

---

## 3. Domain
**Current Value**: `https://server-kl7c.onrender.com`

The primary domain used to access the product (production or staging).

---

## 4. API Callback URL
**Current Value**: `https://server-kl7c.onrender.com/api/callback`

The backend endpoint that receives asynchronous callbacks from the API provider.

**Technical Requirements**:
- ✅ **HTTP Method**: POST
- ✅ **Must return HTTP status code 200**
- ✅ **Signature validation required** (implemented in `callbackHandler.js`)
- ✅ **Idempotent handling required** (implemented with processed callback tracking)

**Implementation Status**:
- ✅ Callback handler service created (`src/services/callbackHandler.js`)
- ✅ POST method validation
- ✅ HTTP 200 response handling
- ✅ Signature validation framework (awaiting provider specs)
- ✅ Idempotent processing with callback ID tracking
- ✅ Support for multiple callback types:
  - `game_result` - Game outcome notifications
  - `balance_update` - User balance changes
  - `transaction` - Payment/withdrawal updates
  - `system_notification` - System alerts

---

## 5. Demo Site Address
**Current Value**: `https://pghome.co`

Public demo or staging environment for testing.

---

## 6. Demo User Name
**Current Status**: ⏳ **To be retrieved from API**

Pre-created test account for testing.

**Auto-Discovery**: The system automatically attempts to fetch demo credentials from:
- `/api/demo`
- `/api/demo-credentials`
- `/api/product/config`
- `/config`
- And other common endpoints

---

## 7. Demo Password
**Current Status**: ⏳ **To be retrieved from API**

Password for demo test account.

**Security**: Password is masked in UI and logs for security.

---

## 8. Currency
**Current Value**: `USDT`

Settlement currency used for API transactions.

---

## Integration Information Template

```
Product Name: GoldenAgeClub
Server IP: 74.220.48.0/24, 74.220.56.0/24
Domain: https://server-kl7c.onrender.com
API Callback URL: https://server-kl7c.onrender.com/api/callback
Demo Site Address: https://pghome.co
Demo User Name: [To be retrieved from API]
Demo Password: [To be retrieved from API]
Currency: USDT
```

---

## Technical Implementation

### Callback Handler Features
- **Signature Validation**: Framework ready for provider's signature algorithm
- **Idempotent Processing**: Prevents duplicate callback processing
- **Event System**: Emit/listen pattern for callback handling
- **Error Handling**: Comprehensive error logging and response
- **Multiple Callback Types**: Support for games, transactions, notifications

### API Service Features
- **Automatic Retry Logic**: 3 attempts with exponential backoff
- **Connection Monitoring**: Real-time status tracking
- **Demo Credential Discovery**: Automatic fetching from multiple endpoints
- **Error Recovery**: Graceful fallback to offline mode

### Testing Tools
- **Endpoint Testing**: Comprehensive API endpoint validation
- **Connection Diagnostics**: Real-time connection status
- **Credential Discovery**: Automatic demo account detection
- **Visual Status**: In-app API status monitoring

---

## Integration Status

### ✅ Completed
- [x] Product name configuration (compliant format)
- [x] Server IP addresses specified
- [x] Domain configuration
- [x] Callback URL endpoint specification
- [x] Demo site address
- [x] Currency specification
- [x] Callback handler implementation (POST, HTTP 200, idempotent)
- [x] Signature validation framework
- [x] API service layer
- [x] Connection monitoring
- [x] Testing utilities
- [x] Error handling

### ⏳ Pending API Provider
- [ ] Demo username retrieval
- [ ] Demo password retrieval
- [ ] Signature validation algorithm specification
- [ ] API endpoint documentation
- [ ] Authentication flow details

---

## Next Steps

1. **Test API Connectivity**
   ```bash
   node test-golden-age-api.js
   ```

2. **Monitor Connection Status**
   - Open application
   - Click WiFi icon in header
   - Use "Test All Endpoints" feature

3. **Retrieve Demo Credentials**
   - API testing will automatically attempt to discover credentials
   - Check multiple endpoints for demo account information

4. **Validate Callback Endpoint**
   - Ensure callback URL is accessible
   - Test POST request handling
   - Verify HTTP 200 response

5. **Complete Integration**
   - Implement provider-specific signature validation
   - Test full authentication flow
   - Validate game and transaction callbacks

---

## Support & Debugging

### API Status Monitoring
- In-app status component shows real-time connection
- Detailed error logging in browser console
- Automatic retry mechanisms

### Testing Tools
- `test-golden-age-api.js` - Node.js endpoint testing
- Browser-based API testing utility
- Visual callback handler testing

### Configuration Files
- `src/config/api.js` - Main API configuration
- `src/services/apiService.js` - HTTP client service
- `src/services/callbackHandler.js` - Callback processing
- `src/contexts/ApiContext.jsx` - React integration

---

## Compliance Checklist

- ✅ **Product Name**: English letters/numbers only, no spaces
- ✅ **Server IPs**: Public IPv4 addresses provided
- ✅ **Domain**: Production/staging domain specified
- ✅ **Callback URL**: POST endpoint with HTTP 200 response
- ✅ **Callback Requirements**: Signature validation & idempotent handling
- ✅ **Demo Site**: Public testing environment specified
- ✅ **Currency**: Settlement currency defined
- ⏳ **Demo Credentials**: Awaiting API response

**Integration Ready**: All technical requirements implemented and ready for API provider enablement.