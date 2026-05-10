import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Landing from './pages/Landing/Landing.jsx'
import IntroFlow from './pages/IntroFlow/IntroFlow.jsx'
import './index.css'
import World from './pages/World/World.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(


      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/intro" element={<IntroFlow />} />
          <Route path="/world" element={<World />} />
        </Routes>
      </BrowserRouter>


)
