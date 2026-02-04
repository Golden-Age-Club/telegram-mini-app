import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Preloader from './components/Preloader.jsx'
import './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Preloader />}>
      <App />
    </Suspense>
  </StrictMode>
)
