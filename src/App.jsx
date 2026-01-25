import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ApiProvider, useApi } from './contexts/ApiContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import router from './router';

function AppContent() {
  const { isLoading: authLoading } = useAuth();
  const { isLoading: apiLoading } = useApi();
  
  // Combine loading states
  // We can decide to only block on authLoading if we want the app to be interactive faster
  // But typically we wait for at least auth to know if we are logged in or not.
  const isLoading = authLoading; 

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
 
      <AuthProvider>
           <ApiProvider>
        <LanguageProvider>
          <ToastProvider>
              <AppContent />
          </ToastProvider>
        </LanguageProvider>
         </ApiProvider>
      </AuthProvider>
  );
}

export default App;
