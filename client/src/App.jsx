import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import NewInterview from './pages/NewInterview'
import InterviewPortal from './components/InterviewPortal'
import About from './components/About'
import Home from './components/Homepage'
import Navbar from './components/Navbar'
const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-interview" element={<NewInterview />} />
          <Route path="/interview-portal" element={<InterviewPortal />} />
          <Route path="/about" element={<About />} />
          <Route path="/interview/:id" element={<InterviewPortal />} />
          <Route path='/new' element={<NewInterview />} />
          <Route path='/interview' element={<InterviewPortal />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App