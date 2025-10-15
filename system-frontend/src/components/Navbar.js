import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getCurrentUser } from '../redux/slices/authSlice';
import { fetchCart } from '../redux/slices/cartSlice';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mzansi Moments Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/events')
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Browse Events
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard')
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/basket"
              className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              <FaShoppingCart className="w-5 h-5" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-1" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
              <Link
                to="/events"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/events')
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                Browse Events
              </Link>

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard')
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/basket"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600"
              >
                <FaShoppingCart className="w-4 h-4 mr-2" />
                Basket
                {getCartItemCount() > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-3 py-2">
                    <FaUser className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;