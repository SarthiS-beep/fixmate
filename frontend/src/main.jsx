import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "488870115916-dnesopc35abeo37ecr0ev5360164mhlp.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter basename="/xyz">
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
