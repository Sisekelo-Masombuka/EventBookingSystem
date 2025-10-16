import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../redux/slices/authSlice';
import { downloadTicket } from '../redux/slices/ticketsSlice';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTicketAlt, FaDownload, FaEdit, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { downloading } = useSelector((state) => state.tickets);
  const API_BASE_URL = 'https://localhost:7037/api';
  const token = useSelector((state) => state.auth.token);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phoneNumber: '',
    gender: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });

  // Always fetch fresh profile so signup details appear without retyping
  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        streetAddress: user.streetAddress || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/bookings`, { headers: authHeaders });
        setBookings(res.data || []);
      } catch (e) {
        // keep empty but show message in UI
        setBookings([]);
      }
    };
    if (token) loadBookings();
  }, [token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        phoneNumber: user.phoneNumber || '',
        streetAddress: user.streetAddress || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`${API_BASE_URL}/users/me`, {
        firstName: editForm.firstName,
        middleName: editForm.middleName || null,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
        gender: editForm.gender || '',
        streetAddress: editForm.streetAddress,
        city: editForm.city,
        postalCode: editForm.postalCode,
        country: editForm.country,
      }, { headers: authHeaders });
      await dispatch(getCurrentUser());
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/users/change-password`, {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      }, { headers: authHeaders });
      toast.success('Password changed successfully');
      setPwdForm({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      await dispatch(downloadTicket(bookingId)).unwrap();
      toast.success('Ticket downloaded successfully!');
    } catch (error) {
      toast.error(error || 'Failed to download ticket');
    }
  };

  const hasBookings = Array.isArray(bookings) && bookings.length > 0;

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please login to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.firstName}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <FaEdit className="w-4 h-4 mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <input
                      type="text"
                      name="gender"
                      value={editForm.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editForm.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaUser className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.middleName} {user.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-gray-900">{user.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium text-gray-900">
                        {user.streetAddress}, {user.city} {user.postalCode}
                      </div>
                      <div className="text-sm text-gray-600">{user.country}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Bookings</h2>
              
              {!hasBookings ? (
                <div className="text-center py-8">
                  <FaTicketAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600 text-lg font-semibold mb-2">No bookings yet</div>
                  <div className="text-gray-500">Start exploring events to make your first booking!</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {b.items?.[0]?.eventTitle}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaCalendarAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {new Date(b.items?.[0]?.eventDate).toLocaleDateString('en-ZA', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {b.items?.reduce((sum, it) => sum + (it.quantity || 0), 0)}x tickets
                          </div>
                          <div className="text-sm text-gray-500">
                            Booked on {new Date(b.bookingDate).toLocaleDateString('en-ZA')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600 mb-2">
                            R{(b.totalAmount || 0).toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              b.status === 'Confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {b.status}
                            </span>
                            {b.status === 'Confirmed' && (
                              <button
                                onClick={() => handleDownloadTicket(b.id)}
                                disabled={downloading}
                                className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {downloading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <FaDownload className="w-4 h-4 mr-1" />
                                    Download
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;