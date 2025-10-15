import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">Mzansi Moments Hub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your premier destination for discovering and booking amazing events across South Africa. 
              From music festivals to tech conferences, we connect you with unforgettable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Music" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Tech" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tech & Innovation
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sport" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link to="/events?category=Other" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Other Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaEnvelope className="w-4 h-4 text-red-600 mr-3" />
                <span className="text-gray-400">info@mzansimomentshub.com</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-4 h-4 text-red-600 mr-3" />
                <span className="text-gray-400">+27 11 123 4567</span>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="w-4 h-4 text-red-600 mr-3 mt-1" />
                <div className="text-gray-400">
                  <div>Sol Plaatje University</div>
                  <div>Kimberley, Northern Cape</div>
                  <div>South Africa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Mzansi Moments Hub. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm">
              Built with ❤️ in South Africa
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;