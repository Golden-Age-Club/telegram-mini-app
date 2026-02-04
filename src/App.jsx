import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { ApiProvider, useApi } from './contexts/ApiContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { LayoutProvider } from './contexts/LayoutContext.jsx';
import { Toaster } from 'sonner';
import router from './router';
import Preloader from './components/Preloader.jsx';

function AppContent() {
  const { isLoading: authLoading } = useAuth();

  // Combine loading states
  // We can decide to only block on authLoading if we want the app to be interactive faster
  // But typically we wait for at least auth to know if we are logged in or not.
  const isLoading = authLoading; 

  if (isLoading) {
    return <Preloader />;
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

      <LanguageProvider>
        <AuthProvider>
           <ApiProvider>
              <AppContent />
              <Toaster position="top-center" theme="dark" richColors closeButton />
           </ApiProvider>
        </AuthProvider>
      </LanguageProvider>
  );
}

export default App;
