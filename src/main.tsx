import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { initializeIdentity } from './lib/identity'
import { reportError } from './lib/errorReporter'

// Initialize identity (anon_id, session_id)
initializeIdentity();

// Global error handlers
window.addEventListener('error', (event) => {
  // Report uncaught errors
  reportError(event.error || new Error(event.message), {
    source: 'window_error',
    extra: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  });
});

window.addEventListener('unhandledrejection', (event) => {
  // Report unhandled promise rejections
  const error = event.reason instanceof Error
    ? event.reason
    : new Error(String(event.reason));

  reportError(error, {
    source: 'unhandled_rejection'
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
