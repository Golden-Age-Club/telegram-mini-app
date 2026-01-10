/**
 * Test script for Golden Age Club API integration
 * Run with: node test-golden-age-api.js
 */

const API_CONFIG = {
  PRODUCT_NAME: 'Golden Age Club',
  SERVER_IPS: ['74.220.48.0/24', '74.220.56.0/24'],
  DOMAIN: 'https://server-kl7c.onrender.com',
  BASE_URL: 'https://server-kl7c.onrender.com',
  CALLBACK_URL: 'https://server-kl7c.onrender.com/api/callback',
  DEMO_SITE: 'https://pghome.co',
  CURRENCY: 'USDT'
};

// Test endpoints to check for demo credentials
const testEndpoints = [
  '/api/demo',
  '/api/demo-credentials',
  '/api/demo-account',
  '/api/config',
  '/api/product/config',
  '/api/product/info',
  '/api/auth/demo',
  '/api/test/demo',
  '/demo',
  '/config',
  '/api/system/info',
  '/api/info',
  '/health',
  '/status',
  '/',
  '/api'
];

async function testEndpoint(endpoint) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    console.log(`\n📡 Testing: ${endpoint}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Golden-Age-Club-Test/1.0'
      },
      timeout: 10000
    });
    
    if (!response.ok) {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
      return { endpoint, success: false, status: response.status, error: response.statusText };
    }
    
    const data = await response.json();
    console.log(`✅ Success: ${response.status}`);
    
    // Check for demo credentials
    const credentials = extractCredentials(data);
    if (credentials) {
      console.log(`🎯 Found credentials: ${credentials.username}/${credentials.password}`);
    }
    
    return {
      endpoint,
      success: true,
      status: response.status,
      data,
      credentials,
      hasCredentials: !!credentials
    };
    
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
    return { endpoint, success: false, error: error.message };
  }
}

function extractCredentials(data) {
  if (!data || typeof data !== 'object') return null;

  // Check various credential patterns
  const patterns = [
    () => data.demo && {
      username: data.demo.username || data.demo.user,
      password: data.demo.password || data.demo.pass
    },
    () => data.demoUsername && data.demoPassword && {
      username: data.demoUsername,
      password: data.demoPassword
    },
    () => data.credentials && {
      username: data.credentials.username,
      password: data.credentials.password
    },
    () => data.testAccount && {
      username: data.testAccount.username,
      password: data.testAccount.password
    },
    () => data.config && data.config.demo && {
      username: data.config.demo.username,
      password: data.config.demo.password
    }
  ];

  for (const pattern of patterns) {
    try {
      const result = pattern();
      if (result && result.username && result.password) {
        return result;
      }
    } catch (e) {
      // Continue to next pattern
    }
  }

  return null;
}

async function testGoldenAgeApi() {
  console.log('🔍 Testing Golden Age Club API...');
  console.log(`📡 Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`🎰 Product: ${API_CONFIG.PRODUCT_NAME}`);
  console.log(`💰 Currency: ${API_CONFIG.CURRENCY}`);
  console.log('─'.repeat(60));

  const results = [];
  
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('─'.repeat(60));
  
  const successful = results.filter(r => r.success);
  const withCredentials = results.filter(r => r.hasCredentials);
  
  console.log(`Total endpoints tested: ${results.length}`);
  console.log(`Successful responses: ${successful.length}`);
  console.log(`Failed responses: ${results.length - successful.length}`);
  console.log(`Endpoints with credentials: ${withCredentials.length}`);
  
  if (withCredentials.length > 0) {
    console.log('\n🎯 Found Demo Credentials:');
    withCredentials.forEach(item => {
      console.log(`  ${item.endpoint}: ${item.credentials.username}/${item.credentials.password}`);
    });
  } else {
    console.log('\n⚠️ No demo credentials found in API responses');
    console.log('\n💡 Suggestions:');
    console.log('1. Check if the API server is running');
    console.log('2. Verify the base URL is correct');
    console.log('3. Contact the backend team for demo credentials');
    console.log('4. Check the demo site for login information');
  }
  
  console.log('\n📋 Configuration Summary:');
  console.log(`Product Name: ${API_CONFIG.PRODUCT_NAME}`);
  console.log(`Server IPs: ${API_CONFIG.SERVER_IPS.join(', ')}`);
  console.log(`Domain: ${API_CONFIG.DOMAIN}`);
  console.log(`Callback URL: ${API_CONFIG.CALLBACK_URL}`);
  console.log(`Demo Site: ${API_CONFIG.DEMO_SITE}`);
  console.log(`Currency: ${API_CONFIG.CURRENCY}`);
  
  return results;
}

// Run the test
if (typeof module !== 'undefined' && require.main === module) {
  testGoldenAgeApi().catch(console.error);
}

module.exports = { testGoldenAgeApi, API_CONFIG };