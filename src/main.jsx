import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Landing from './pages/Landing/Landing.jsx'
import './index.css'
import Auth from './pages/Auth/Auth.jsx'
import Intro3D from './pages/Intro3D/Intro3D.jsx'
import IntroFlow from './pages/IntroFlow/IntroFlow.jsx'
import ChooseGuide from './pages/ChooseGuide/ChooseGuide.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/choose-guide" element={<ChooseGuide />} />
      <Route path="/intro" element={<IntroFlow />} />
    </Routes>
  </BrowserRouter>
)
