import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaTicketAlt, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPortal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const stats = {
    totalEvents: 12,
    totalBookings: 156,
    totalRevenue: 125000,
    totalUsers: 89
  };

  const recentBookings = [
    {
      id: '1',
      user: 'John Doe',
      event: 'Cape Town Jazz Festival',
      tickets: 2,
      amount: 1500,
      status: 'Confirmed',
      date: '2025-10-15'
    },
    {
      id: '2',
      user: 'Jane Smith',
      event: 'Tech Conference SA',
      tickets: 1,
      amount: 1200,
      status: 'Pending',
      date: '2025-10-14'
    }
  ];

  const events = [
    {
      id: '1',
      title: 'Cape Town Jazz Festival 2025',
      category: 'Music',
      city: 'Cape Town',
      date: '2025-11-14',
      capacity: 5000,
      sold: 3200,
      status: 'Active'
    },
    {
      id: '2',
      title: 'Tech Conference SA 2025',
      category: 'Tech',
      city: 'Johannesburg',
      date: '2025-11-29',
      capacity: 2000,
      sold: 1200,
      status: 'Active'
    }
  ];

  const handleLogout = () => {
    // Dispatch logout action
    toast.success('Logged out successfully');
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      toast.success('Event deleted successfully');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading admin portal..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              <FaSignOutAlt className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaChartBar className="w-4 h-4 mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === 'events'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaTicketAlt className="w-4 h-4 mr-3" />
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === 'bookings'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaUsers className="w-4 h-4 mr-3" />
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaCog className="w-4 h-4 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FaTicketAlt className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
                        <div className="text-sm text-gray-600">Total Events</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaUsers className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                        <div className="text-sm text-gray-600">Total Bookings</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaChartBar className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FaUsers className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                        <div className="text-sm text-gray-600">Registered Users</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tickets
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {booking.user}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.event}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.tickets}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(booking.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === 'Confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center">
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Event
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          City
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sold/Capacity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-ZA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.sold.toLocaleString()}/{event.capacity.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              event.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600">Bookings management functionality will be implemented here.</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600">Admin settings and configuration will be implemented here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;