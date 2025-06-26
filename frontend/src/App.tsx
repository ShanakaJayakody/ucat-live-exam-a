import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExamEngine from './components/ExamEngine';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/exam" element={<ExamEngine />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
