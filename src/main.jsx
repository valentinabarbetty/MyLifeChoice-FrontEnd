import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Landing from './pages/Landing/Landing.jsx'
import './index.css'
import Auth from './pages/Auth/Auth.jsx'
import Instructions from './pages/Instructions/Instructions.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/instructions" element={<Instructions />} />
    </Routes>
  </BrowserRouter>
)
