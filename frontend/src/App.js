import React from 'react'
import {
  Routes, Route, Navigate, BrowserRouter,
} from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Diary from './components/Diary'

const App = () => (
  <div className="container">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/diary" element={<Diary />} />
      </Routes>
    </BrowserRouter>
  </div>
)

export default App
