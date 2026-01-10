/**
 * API Status Component for Golden Age Club
 * Shows connection status and allows testing
 */

import React, { useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { testGoldenAgeApi } from '../utils/apiTester';

const ApiStatus = ({ onClose }) => {
  const { 
    isConnected, 
    isLoading, 
    config, 
    demoCredentials, 
    error,
    initializeApi 
  } = useApi();
  
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestApi = async () => {
    setIsTesting(true);
    try {
      const results = await testGoldenAgeApi();
      setTestResults(results);
    } catch (err) {
      console.error('API test failed:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleRetryConnection = async () => {
    await initializeApi();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">API Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Connection Status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Connection Status</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          {/* API Configuration */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Configuration</h3>
            <div className="bg-gray-800 rounded-lg p-3 text-sm">
              <div className="grid grid-cols-1 gap-1">
                <div><span className="text-gray-400">Product:</span> <span className="text-white">{config?.PRODUCT_NAME}</span></div>
                <div><span className="text-gray-400">Domain:</span> <span className="text-white">{config?.DOMAIN}</span></div>
                <div><span className="text-gray-400">Currency:</span> <span className="text-white">{config?.CURRENCY}</span></div>
                <div><span className="text-gray-400">Demo Site:</span> <span className="text-white">{config?.DEMO_SITE}</span></div>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Demo Credentials</h3>
            {demoCredentials ? (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-sm">
                <div className="text-green-400">✅ Credentials Available</div>
                <div className="text-gray-300 mt-1">
                  Username: <span className="font-mono">{demoCredentials.username}</span>
                </div>
                <div className="text-gray-300">
                  Password: <span className="font-mono">{'•'.repeat(demoCredentials.password?.length || 0)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-sm">
                <div className="text-yellow-400">⚠️ No credentials found</div>
                <div className="text-gray-300 mt-1">
                  Demo credentials not available from API
                </div>
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Test Results</h3>
              <div className="bg-gray-800 rounded-lg p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-gray-400">Total:</span> <span className="text-white">{testResults.total}</span></div>
                  <div><span className="text-gray-400">Success:</span> <span className="text-green-400">{testResults.successful}</span></div>
                  <div><span className="text-gray-400">Failed:</span> <span className="text-red-400">{testResults.failed}</span></div>
                  <div><span className="text-gray-400">With Creds:</span> <span className="text-blue-400">{testResults.withCredentials}</span></div>
                </div>
                
                {testResults.credentials.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="text-green-400 text-xs mb-1">Found credentials:</div>
                    {testResults.credentials.map((item, index) => (
                      <div key={index} className="text-xs text-gray-300">
                        {item.endpoint}: {item.credentials.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleTestApi}
              disabled={isTesting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {isTesting ? 'Testing API...' : 'Test All Endpoints'}
            </button>
            
            <button
              onClick={handleRetryConnection}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? 'Connecting...' : 'Retry Connection'}
            </button>
          </div>

          {/* Server Information */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Server Information</h3>
            <div className="bg-gray-800 rounded-lg p-3 text-xs">
              <div className="space-y-1">
                <div><span className="text-gray-400">Server IPs:</span></div>
                {config?.SERVER_IPS?.map((ip, index) => (
                  <div key={index} className="text-gray-300 ml-2">• {ip}</div>
                ))}
                <div className="mt-2"><span className="text-gray-400">Callback URL:</span></div>
                <div className="text-gray-300 ml-2 break-all">{config?.CALLBACK_URL}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus;