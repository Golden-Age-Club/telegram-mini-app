/**
 * API Testing Utility for Golden Age Club
 * Tests API endpoints and fetches demo credentials
 */

import { apiService } from '../services/apiService';
import { API_CONFIG } from '../config/api';

export class ApiTester {
  constructor() {
    this.results = [];
  }

  /**
   * Test all API endpoints to find demo credentials
   */
  async testAllEndpoints() {
    console.log('🔍 Testing Golden Age Club API endpoints...');
    console.log(`📡 Base URL: ${API_CONFIG.BASE_URL}`);
    console.log(`🎰 Product: ${API_CONFIG.PRODUCT_NAME}`);
    console.log('─'.repeat(60));

    const testEndpoints = [
      // Demo credential endpoints
      '/api/demo',
      '/api/demo-credentials',
      '/api/demo-account',
      '/demo',
      
      // Configuration endpoints
      '/api/config',
      '/api/product/config',
      '/api/product/info',
      '/config',
      
      // Authentication endpoints
      '/api/auth/demo',
      '/api/test/demo',
      '/api/auth/config',
      
      // System endpoints
      '/api/system/info',
      '/api/info',
      '/health',
      '/status',
      
      // Root endpoints
      '/',
      '/api'
    ];

    for (const endpoint of testEndpoints) {
      await this.testEndpoint(endpoint);
    }

    return this.results;
  }

  /**
   * Test a single endpoint
   */
  async testEndpoint(endpoint) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      console.log(`\n📡 Testing: ${endpoint}`);
      
      const result = await apiService.makeRequest(endpoint);
      
      if (result.success) {
        console.log(`✅ Success: ${result.status}`);
        
        // Check if response contains demo credentials
        const credentials = this.extractCredentials(result.data);
        
        this.results.push({
          endpoint,
          url,
          status: result.status,
          success: true,
          data: result.data,
          credentials,
          hasCredentials: !!credentials
        });
        
        if (credentials) {
          console.log(`🎯 Found credentials: ${credentials.username}/${credentials.password}`);
        }
        
      } else {
        console.log(`❌ Failed: ${result.error}`);
        this.results.push({
          endpoint,
          url,
          status: result.status,
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
      this.results.push({
        endpoint,
        url,
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Extract demo credentials from API response
   */
  extractCredentials(data) {
    if (!data || typeof data !== 'object') return null;

    // Check various credential formats
    const patterns = [
      // Direct demo object
      () => data.demo && {
        username: data.demo.username || data.demo.user,
        password: data.demo.password || data.demo.pass
      },
      
      // Direct demo fields
      () => data.demoUsername && data.demoPassword && {
        username: data.demoUsername,
        password: data.demoPassword
      },
      
      // Credentials object
      () => data.credentials && {
        username: data.credentials.username,
        password: data.credentials.password
      },
      
      // Test account
      () => data.testAccount && {
        username: data.testAccount.username,
        password: data.testAccount.password
      },
      
      // Account object
      () => data.account && {
        username: data.account.username,
        password: data.account.password
      },
      
      // User object
      () => data.user && {
        username: data.user.username,
        password: data.user.password
      },
      
      // Config demo
      () => data.config && data.config.demo && {
        username: data.config.demo.username,
        password: data.config.demo.password
      },
      
      // Product demo
      () => data.product && data.product.demo && {
        username: data.product.demo.username,
        password: data.product.demo.password
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

  /**
   * Get summary of test results
   */
  getSummary() {
    const successful = this.results.filter(r => r.success);
    const withCredentials = this.results.filter(r => r.hasCredentials);
    
    return {
      total: this.results.length,
      successful: successful.length,
      failed: this.results.length - successful.length,
      withCredentials: withCredentials.length,
      credentials: withCredentials.map(r => ({
        endpoint: r.endpoint,
        credentials: r.credentials
      }))
    };
  }

  /**
   * Print detailed results
   */
  printResults() {
    console.log('\n📊 API Test Results Summary');
    console.log('─'.repeat(60));
    
    const summary = this.getSummary();
    
    console.log(`Total endpoints tested: ${summary.total}`);
    console.log(`Successful responses: ${summary.successful}`);
    console.log(`Failed responses: ${summary.failed}`);
    console.log(`Endpoints with credentials: ${summary.withCredentials}`);
    
    if (summary.credentials.length > 0) {
      console.log('\n🎯 Found Demo Credentials:');
      summary.credentials.forEach(item => {
        console.log(`  ${item.endpoint}: ${item.credentials.username}/${item.credentials.password}`);
      });
    } else {
      console.log('\n⚠️ No demo credentials found in API responses');
    }
    
    console.log('\n📋 Detailed Results:');
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.endpoint} - ${result.success ? result.status : result.error}`);
    });
  }
}

/**
 * Quick test function for console use
 */
export async function testGoldenAgeApi() {
  const tester = new ApiTester();
  await tester.testAllEndpoints();
  tester.printResults();
  return tester.getSummary();
}

export default ApiTester;