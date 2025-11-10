import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Landing from './pages/Landing/Landing.jsx'
import IntroFlow from './pages/IntroFlow/IntroFlow.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import './index.css'


//const GOOGLE_CLIENT_ID = "183624025015-dpp2h6idnrj3o9h68fqiq2nbea2be3dq.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/intro" element={<IntroFlow />} />
        </Routes>
      </BrowserRouter>

  </React.StrictMode>
)
