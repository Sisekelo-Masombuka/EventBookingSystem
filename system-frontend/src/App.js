import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import BrowseEvents from './pages/BrowseEvents';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Basket from './pages/Basket';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminPortal from './pages/AdminPortal';
import TestAdminLogin from './pages/TestAdminLogin';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Help from './pages/Help';
import Contact from './pages/Contact';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // If not authenticated, route to the correct login
  if (!isAuthenticated) {
    return adminOnly ? <Navigate to="/admin-login" replace /> : <Navigate to="/login" replace />;
  }

  // If authenticated and route is NOT admin-only, allow immediately (avoid spinner flicker)
  if (!adminOnly) {
    return children;
  }

  // Admin-only: if we're still resolving user, show spinner briefly
  if (loading && !user) {
    return <LoadingSpinner />;
  }

  // Enforce admin role
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Content Component
const AppContent = () => {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch current user only if we have a token but no user in state
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Do not block entire app on loading; route guards will handle auth

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated && user?.role === 'Admin' ? <Navigate to="/admin" replace /> : <HomePage />} />
            <Route path="/events" element={<BrowseEvents />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-admin" element={<TestAdminLogin />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/basket" 
              element={
                <ProtectedRoute>
                  <Basket />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-login" 
              element={<AdminLogin />} 
            />
          </Routes>
        </main>
        {!(isAuthenticated && user?.role === 'Admin') && <Footer />}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;