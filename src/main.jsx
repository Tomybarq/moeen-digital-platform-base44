import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { initGlobalErrorHandlers } from '@/lib/errorLogger'

// Capture all unhandled errors platform-wide
initGlobalErrorHandlers();

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)