import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './styles/App.css';

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="global-animated-background">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="bg-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <div
          key={`floating-${i}`}
          className="bg-floating-element"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loader">Loading...</div>;
  }
  
  if (!user) {
    // Store the attempted location for redirect after login
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  return children;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loader">Loading...</div>;
  }
  
  if (user) {
    // Check if there's a stored redirect path
    const redirectPath = localStorage.getItem('redirectPath');
    if (redirectPath && redirectPath !== '/login' && redirectPath !== '/signup') {
      localStorage.removeItem('redirectPath');
      return <Navigate to={redirectPath} />;
    }
    return <Navigate to="/home" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure localStorage is read
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <AnimatedBackground />
              <AppRoutes />
            </div>
          </Router>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
