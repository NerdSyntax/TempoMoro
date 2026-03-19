import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from './context/SettingsContext.jsx'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 40, color: '#ff4444', background: '#111', height: '100vh', fontFamily: 'monospace'}}>
          <h2>CRASH CAUGHT BY ERROR BOUNDARY</h2>
          <p>Please send this error to the AI assistant:</p>
          <pre style={{whiteSpace: 'pre-wrap', background: '#222', padding: 20, borderRadius: 10}}>
            {this.state.error.toString()}
            {this.state.error.stack && `\n\nStack:\n${this.state.error.stack}`}
          </pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
