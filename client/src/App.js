import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Chat from './Components/Chat';

function PrivateRoute({ element: Component }) {
  const token = localStorage.getItem('token');
  return token ? <Component /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<PrivateRoute element={Chat} />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
