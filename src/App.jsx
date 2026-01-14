import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApiProvider, useApi } from './contexts/ApiContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import router from './router';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const tg = window.Telegram?.WebApp;
  
  // Use API and Auth contexts
  const { 
    isConnected
  } = useApi();
  
  const {
    user,
    loginWithDemo
  } = useAuth();

  // Initialize Telegram WebApp
  useEffect(() => {
    let initializationDone = false;
    
    const initializeApp = async () => {
      if (initializationDone) return;
      initializationDone = true;
      
      // Clear any existing toasts first
      toast.clearAll();
      
      if (tg) {
        tg.ready();
        tg.expand();
        
        // Set Golden Age Cash theme colors (only if supported)
        if (tg.setHeaderColor) {
          tg.setHeaderColor('#000000');
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor('#000000');
        }
        
        // Get user from Telegram or use API user
        if (tg.initDataUnsafe?.user && !user) {
          const tgUser = tg.initDataUnsafe.user;
          
          // Try to login with demo credentials
          const loginResult = await loginWithDemo();
          if (loginResult?.success) {
            toast.success(`Welcome to Golden Age Club, ${tgUser.first_name}!`);
          }
        }
      }
      
      setIsLoading(false);
    };

    // Only initialize when contexts are ready
    if (isLoading) {
      initializeApp();
    }
  }, [isLoading, isConnected, user, loginWithDemo, toast, tg]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center glow-gold overflow-hidden">
            <img 
              src="/casinologo.jpg" 
              alt="Golden Age Cash"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="loading-dots mb-4">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="text-gray-400">Initializing Golden Age Club...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app min-h-screen bg-gradient-primary">
      <LayoutProvider>
        <RouterProvider router={router} />
      </LayoutProvider>
    </div>
  );
}

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <LanguageProvider>
          <ToastProvider>
            <WalletProvider>
              <AppContent />
            </WalletProvider>
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
