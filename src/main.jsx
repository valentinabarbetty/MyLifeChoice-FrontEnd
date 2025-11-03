import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Landing from './pages/Landing/Landing.jsx'
import IntroFlow from './pages/IntroFlow/IntroFlow.jsx'
import ChooseGuide from './pages/ChooseGuide/ChooseGuide.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import './index.css'

// 🚀 Agrega tu Client ID de Google aquí:
const GOOGLE_CLIENT_ID = "183624025015-56bgdj86f3ejt6uqvus8f1e1ajqq3ubt.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/choose-guide" element={<ChooseGuide />} />
          <Route path="/intro" element={<IntroFlow />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
