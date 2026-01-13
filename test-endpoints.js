/**
 * Script to test backend API endpoints and find demo credentials
 * Run with: node test-endpoints.js
 */

const API_BASE = 'https://server-kl7c.onrender.com';
const DEMO_SITE = 'https://pghome.co';

// Common endpoint patterns to try
const endpoints = [
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
  '/product',
  '/',
];

async function testEndpoint(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      status: response.status,
      ok: response.ok,
      data,
      url,
    };
  } catch (error) {
    return {
      status: 'ERROR',
      ok: false,
      error: error.message,
      url,
    };
  }
}

async function testAllEndpoints() {
  console.log('🔍 Testing API endpoints for Golden Age Club...\n');
  console.log(`API Base: ${API_BASE}`);
  console.log(`Demo Site: ${DEMO_SITE}\n`);
  console.log('─'.repeat(60));

  for (const endpoint of endpoints) {
    const url = `${API_BASE}${endpoint}`;
    console.log(`\n📡 Testing: ${url}`);
    
    const result = await testEndpoint(url);
    
    if (result.ok) {
      console.log(`✅ Status: ${result.status}`);
      console.log('Response:', JSON.stringify(result.data, null, 2).substring(0, 500));
    } else if (result.status !== 'ERROR') {
      console.log(`❌ Status: ${result.status}`);
      if (result.error) {
        console.log(`Error: ${result.error}`);
      }
    } else {
      console.log(`❌ Error: ${result.error}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '─'.repeat(60));
  console.log('\n💡 Tips:');
  console.log('1. Look for responses containing "demo", "username", "password"');
  console.log('2. Check for product config endpoints that might have this info');
  console.log('3. Try POST requests to /api/auth/login with common demo credentials');
  console.log('4. Check the demo site (pghome.co) documentation or source code');
  console.log('5. Contact the backend team for API documentation');
}

// Also test some POST endpoints that might return config
async function testConfigEndpoints() {
  console.log('\n\n🔧 Testing configuration endpoints...\n');
  
  const postEndpoints = [
    { url: `${API_BASE}/api/product/config`, method: 'POST' },
    { url: `${API_BASE}/api/config`, method: 'POST' },
  ];

  for (const { url, method } of postEndpoints) {
    console.log(`\n📡 Testing ${method}: ${url}`);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          product: 'Golden Age Club',
          domain: DEMO_SITE,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response:', JSON.stringify(data, null, 2));
      } else {
        console.log(`❌ Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Run tests
testAllEndpoints()
  .then(() => testConfigEndpoints())
  .catch(console.error);
