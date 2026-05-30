import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'

import App from './App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>

    <Routes>

      <Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
      <Route path="/analyzer" element={<App />} />

      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>

  </BrowserRouter>

)