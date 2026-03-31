import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Students     from './pages/Students';
import Scanner      from './pages/Scanner';
import SendEmails   from './pages/SendEmails';
import Layout       from './components/Layout';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index        element={<Dashboard />} />
            <Route path="students"   element={<Students />} />
            <Route path="scanner"    element={<Scanner />} />
            <Route path="send-emails" element={<SendEmails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
