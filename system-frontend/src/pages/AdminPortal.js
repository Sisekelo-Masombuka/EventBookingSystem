import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaTicketAlt, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area, Legend } from 'recharts';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { logout } from '../redux/slices/authSlice';
import { fetchOverview, fetchAdminBookings, changeAdminPassword, updateAdminProfile, resetAdminPassword } from '../redux/slices/adminSlice';

const AdminPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { overview, bookings, pagination, loading, actionLoading } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Events state (admin list)
  const [events, setEvents] = useState([]);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsPageSize, setEventsPageSize] = useState(10);
  const [eventsTotalPages, setEventsTotalPages] = useState(1);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: '',
    locationCity: '',
    venue: '',
    startDateTime: '',
    endDateTime: '',
    posterUrl: '',
    capacity: 0,
  });
  const [eventTickets, setEventTickets] = useState([]);

  // Ticket types manager state
  const [showTicketManager, setShowTicketManager] = useState(false);
  const [ticketEventId, setTicketEventId] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [ticketForm, setTicketForm] = useState({ name: '', price: 0, quantityAvailable: 0, isActive: true });
  const [editingTicketId, setEditingTicketId] = useState(null);

  // Settings state
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });
  const [promoteForm, setPromoteForm] = useState({ email: '', newPassword: '' });

  // Derived datasets for charts
  const bookingsPerEventData = React.useMemo(() => {
    const stats = overview?.eventStats || [];
    return stats.slice(0, 12).map(e => ({ name: e.title, bookings: e.soldTickets || 0 }));
  }, [overview]);

  const revenueTrendData = React.useMemo(() => {
    const list = bookings || [];
    const map = new Map();
    list.forEach(b => {
      // use paidAt if available and payment status Completed, otherwise bookingDate
      const paid = b.payment?.status === 'Completed' && b.payment?.paidAt ? b.payment.paidAt : b.bookingDate;
      if (!paid) return;
      const d = new Date(paid);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      map.set(key, (map.get(key) || 0) + (b.totalAmount || 0));
    });
    const arr = Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b))
      .map(([k,v]) => ({ month: k, revenue: v }));
    return arr.slice(-12);
  }, [bookings]);

  const userActivityData = React.useMemo(() => {
    const list = bookings || [];
    const map = new Map();
    list.forEach(b => {
      const d = new Date(b.bookingDate);
      const key = d.toISOString().slice(0,10);
      map.set(key, (map.get(key) || 0) + 1);
    });
    const arr = Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b))
      .map(([k,v]) => ({ day: k, bookings: v }));
    return arr.slice(-30);
  }, [bookings]);

  useEffect(() => {
    if (activeTab === 'settings' && user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'overview') {
      dispatch(fetchOverview());
    }
    if (activeTab === 'bookings') {
      dispatch(fetchAdminBookings({ page: 1, pageSize: 20 }));
    }
  }, [dispatch, activeTab]);

  // Fetch events when Events tab is active
  useEffect(() => {
    const fetchEvents = async () => {
      if (activeTab !== 'events') return;
      try {
        setLoadingLocal(true);
        // Reuse public events endpoint with pagination params
        const res = await axios.get(`${API_BASE_URL}/events`, {
          params: { page: eventsPage, pageSize: eventsPageSize },
          headers: authHeaders,
        });
        setEvents(res.data.events || res.data.items || res.data || []);
        const pg = res.data.pagination || { totalPages: 1 };
        setEventsTotalPages(pg.totalPages || 1);
      } catch (e) {
        setError('Failed to load events');
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, eventsPage, eventsPageSize]);

  const openTicketManager = async (ev) => {
    setTicketEventId(ev.id);
    setShowTicketManager(true);
    setEditingTicketId(null);
    setTicketForm({ name: '', price: 0, quantityAvailable: 0, isActive: true });
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${ev.id}`, { headers: authHeaders });
      setTicketTypes(res.data.ticketTypes || []);
    } catch (e) {
      toast.error('Failed to load ticket types');
    }
  };

  const handleTicketFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : name === 'price' || name === 'quantityAvailable' ? Number(value || 0) : value }));
  };

  const saveTicketType = async (e) => {
    e.preventDefault();
    try {
      if (!editingTicketId) {
        await axios.post(`${API_BASE_URL}/events/${ticketEventId}/ticket-types`, {
          name: ticketForm.name,
          price: ticketForm.price,
          quantityAvailable: ticketForm.quantityAvailable,
        }, { headers: authHeaders });
        toast.success('Ticket type added');
      } else {
        await axios.put(`${API_BASE_URL}/events/ticket-types/${editingTicketId}`, {
          name: ticketForm.name,
          price: ticketForm.price,
          quantityAvailable: ticketForm.quantityAvailable,
          isActive: ticketForm.isActive,
        }, { headers: authHeaders });
        toast.success('Ticket type updated');
      }
      // refresh
      const res = await axios.get(`${API_BASE_URL}/events/${ticketEventId}`, { headers: authHeaders });
      setTicketTypes(res.data.ticketTypes || []);
      setEditingTicketId(null);
      setTicketForm({ name: '', price: 0, quantityAvailable: 0, isActive: true });
    } catch (err) {
      toast.error('Failed to save ticket type');
    }
  };

  const editTicketRow = (tt) => {
    setEditingTicketId(tt.id);
    setTicketForm({ name: tt.name, price: tt.price, quantityAvailable: tt.quantityAvailable, isActive: !(tt.isSoldOut === true) });
  };

  const deleteTicketType = async (id) => {
    if (!window.confirm('Delete this ticket type?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/events/ticket-types/${id}`, { headers: authHeaders });
      toast.success('Ticket type deleted');
      const res = await axios.get(`${API_BASE_URL}/events/${ticketEventId}`, { headers: authHeaders });
      setTicketTypes(res.data.ticketTypes || []);
    } catch (e) {
      toast.error('Failed to delete ticket type');
    }
  };

  // Settings handlers (component scope)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await dispatch(changeAdminPassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword })).unwrap();
      toast.success('Password changed');
      setPwdForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to change password');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateAdminProfile(profileForm)).unwrap();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update profile');
    }
  };

  const handlePromoteAdmin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(resetAdminPassword(promoteForm)).unwrap();
      toast.success('Admin created/promoted');
      setPromoteForm({ email: '', newPassword: '' });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to create/promote admin');
    }
  };

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ title: '', description: '', category: '', locationCity: '', venue: '', startDateTime: '', endDateTime: '', posterUrl: '', capacity: 0 });
    setEventTickets([{ name: '', price: 0, quantityAvailable: 0 }]);
    setShowEventForm(true);
  };

  const openEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventForm({
      title: ev.title || '',
      description: ev.description || '',
      category: ev.category || '',
      locationCity: ev.locationCity || '',
      venue: ev.venue || '',
      startDateTime: ev.startDateTime ? ev.startDateTime.substring(0,16) : '',
      endDateTime: ev.endDateTime ? ev.endDateTime.substring(0,16) : '',
      posterUrl: ev.posterUrl || '',
      capacity: ev.capacity || 0,
    });
    setEventTickets([]); // Editing ticket types is handled via Ticket Manager
    setShowEventForm(true);
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: name === 'capacity' ? parseInt(value || '0', 10) : value }));
  };

  const addEventTicketRow = () => {
    setEventTickets((rows) => [...rows, { name: '', price: 0, quantityAvailable: 0 }]);
  };

  const removeEventTicketRow = (index) => {
    setEventTickets((rows) => rows.filter((_, i) => i !== index));
  };

  const updateEventTicketRow = (index, field, value) => {
    setEventTickets((rows) => rows.map((r, i) => i === index ? { ...r, [field]: field === 'price' || field === 'quantityAvailable' ? Number(value || 0) : value } : r));
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category,
        locationCity: eventForm.locationCity,
        venue: eventForm.venue,
        startDateTime: new Date(eventForm.startDateTime).toISOString(),
        endDateTime: new Date(eventForm.endDateTime).toISOString(),
        posterUrl: eventForm.posterUrl,
        capacity: eventForm.capacity,
      };
      if (!editingEvent) {
        // Include ticket types on create
        const ticketTypes = (eventTickets || []).filter(t => (t.name || '').trim() && t.price > 0 && t.quantityAvailable > 0);
        payload.TicketTypes = ticketTypes.map(t => ({ name: t.name.trim(), price: Number(t.price), quantityAvailable: Number(t.quantityAvailable) }));
        await axios.post(`${API_BASE_URL}/events`, payload, { headers: authHeaders });
        toast.success('Event created');
      } else {
        await axios.put(`${API_BASE_URL}/events/${editingEvent.id}`, payload, { headers: authHeaders });
        toast.success('Event updated');
      }
      setShowEventForm(false);
      setEditingEvent(null);
      // Refresh list
      const res = await axios.get(`${API_BASE_URL}/events`, { params: { page: eventsPage, pageSize: eventsPageSize }, headers: authHeaders });
      setEvents(res.data.events || res.data.items || res.data || []);
      const pg = res.data.pagination || { totalPages: 1 };
      setEventsTotalPages(pg.totalPages || 1);
    } catch (err) {
      toast.error('Failed to save event');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`, { headers: authHeaders });
      toast.success('Event deleted successfully');
      // Refresh list
      const res = await axios.get(`${API_BASE_URL}/events`, { params: { page: eventsPage, pageSize: eventsPageSize }, headers: authHeaders });
      setEvents(res.data.events || res.data.items || res.data || []);
      const pg = res.data.pagination || { totalPages: 1 };
      setEventsTotalPages(pg.totalPages || 1);
    } catch (e) {
      toast.error('Failed to delete event');
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
                        <div className="text-2xl font-bold text-gray-900">{overview?.summary?.totalEvents ?? 0}</div>
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
                        <div className="text-2xl font-bold text-gray-900">{overview?.summary?.totalBookings ?? 0}</div>
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
                        <div className="text-2xl font-bold text-gray-900">{formatPrice(overview?.summary?.totalRevenue ?? 0)}</div>
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
                        <div className="text-2xl font-bold text-gray-900">{overview?.summary?.totalUsers ?? 0}</div>
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
                        {(overview?.recentBookings || []).map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {booking.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.eventTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.items?.length ?? ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(booking.totalAmount)}
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

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bookings per Event */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings per Event</h3>
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer>
                        <BarChart data={bookingsPerEventData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={60} tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="bookings" fill="#ef4444" name="Bookings" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Trend */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends (last 12 months)</h3>
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer>
                        <LineChart data={revenueTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(v)=>`R ${Number(v).toLocaleString()}`} />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" stroke="#16a34a" name="Revenue" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* User Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity (bookings last 30 days)</h3>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <AreaChart data={userActivityData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <defs>
                          <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="bookings" stroke="#ef4444" fillOpacity={1} fill="url(#colorAct)" name="Bookings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Change Password */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                        <input type="password" value={pwdForm.currentPassword} onChange={(e)=>setPwdForm(p=>({...p,currentPassword:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">New Password</label>
                        <input type="password" value={pwdForm.newPassword} onChange={(e)=>setPwdForm(p=>({...p,newPassword:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <button type="submit" disabled={actionLoading} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50">Update Password</button>
                    </form>
                  </div>

                  {/* Update Profile */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">First Name</label>
                          <input value={profileForm.firstName} onChange={(e)=>setProfileForm(p=>({...p,firstName:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                          <input value={profileForm.lastName} onChange={(e)=>setProfileForm(p=>({...p,lastName:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Email</label>
                          <input type="email" value={profileForm.email} onChange={(e)=>setProfileForm(p=>({...p,email:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" required />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Phone</label>
                          <input value={profileForm.phoneNumber} onChange={(e)=>setProfileForm(p=>({...p,phoneNumber:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" />
                        </div>
                      </div>
                      <button type="submit" disabled={actionLoading} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50">Save Profile</button>
                    </form>
                  </div>
                </div>

                {/* Promote/Create Admin */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create/Promote Admin</h3>
                  <form onSubmit={handlePromoteAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-sm text-gray-700 mb-1">Email</label>
                      <input type="email" value={promoteForm.email} onChange={(e)=>setPromoteForm(p=>({...p,email:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="admin@example.com" required />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm text-gray-700 mb-1">New Password</label>
                      <input type="password" value={promoteForm.newPassword} onChange={(e)=>setPromoteForm(p=>({...p,newPassword:e.target.value}))} className="w-full border border-gray-300 rounded px-3 py-2" required />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <button type="submit" disabled={actionLoading} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50">Create/Promote</button>
                    </div>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">If the user exists, this will set their role to Admin and reset the password. Otherwise, register a user first, then promote here.</p>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
                  <button onClick={openAddEvent} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center">
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Event
                  </button>
                </div>

                {showEventForm && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
                    <form onSubmit={saveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Title</label>
                        <input name="title" value={eventForm.title} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Category</label>
                        <input name="category" value={eventForm.category} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={eventForm.description} onChange={handleEventFormChange} rows={3} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">City</label>
                        <input name="locationCity" value={eventForm.locationCity} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Venue</label>
                        <input name="venue" value={eventForm.venue} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Start Date/Time</label>
                        <input type="datetime-local" name="startDateTime" value={eventForm.startDateTime} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">End Date/Time</label>
                        <input type="datetime-local" name="endDateTime" value={eventForm.endDateTime} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Poster URL</label>
                        <input name="posterUrl" value={eventForm.posterUrl} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Capacity</label>
                        <input type="number" min="0" name="capacity" value={eventForm.capacity} onChange={handleEventFormChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
                      </div>

                      {/* Ticket Types for Create */}
                      {!editingEvent && (
                        <div className="md:col-span-2 mt-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-md font-semibold text-gray-900">Ticket Types</h4>
                            <button type="button" onClick={addEventTicketRow} className="text-sm px-3 py-1 border rounded">Add Ticket Type</button>
                          </div>
                          <div className="space-y-3">
                            {(eventTickets || []).map((row, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                                <div className="md:col-span-5">
                                  <label className="block text-sm text-gray-700 mb-1">Name</label>
                                  <input value={row.name} onChange={(e)=>updateEventTicketRow(idx,'name',e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Early Bird" />
                                </div>
                                <div className="md:col-span-3">
                                  <label className="block text-sm text-gray-700 mb-1">Price</label>
                                  <input type="number" min="0" step="0.01" value={row.price} onChange={(e)=>updateEventTicketRow(idx,'price',e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
                                </div>
                                <div className="md:col-span-3">
                                  <label className="block text-sm text-gray-700 mb-1">Quantity</label>
                                  <input type="number" min="0" value={row.quantityAvailable} onChange={(e)=>updateEventTicketRow(idx,'quantityAvailable',e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
                                </div>
                                <div className="md:col-span-1 flex md:justify-end">
                                  <button type="button" onClick={() => removeEventTicketRow(idx)} className="px-3 py-2 border rounded">Remove</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Only rows with a name, price &gt; 0 and quantity &gt; 0 will be created.</p>
                        </div>
                      )}

                      <div className="md:col-span-2 flex items-center gap-2 mt-2">
                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Save</button>
                        <button type="button" onClick={() => { setShowEventForm(false); setEditingEvent(null); }} className="px-4 py-2 border rounded">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(events || []).map((ev) => (
                        <tr key={ev.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ev.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ev.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ev.locationCity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ev.startDateTime).toLocaleString('en-ZA')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(ev.capacity || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button onClick={() => openEditEvent(ev)} className="text-indigo-600 hover:text-indigo-900" title="Edit"><FaEdit className="w-4 h-4" /></button>
                              <button onClick={() => openTicketManager(ev)} className="text-gray-700 hover:text-gray-900" title="Tickets"><FaTicketAlt className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteEvent(ev.id)} className="text-red-600 hover:text-red-900" title="Delete"><FaTrash className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Events pagination */}
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button onClick={() => setEventsPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={eventsPage <= 1}>Prev</button>
                  <span className="text-sm text-gray-600">Page {eventsPage} of {eventsTotalPages}</span>
                  <button onClick={() => setEventsPage((p) => Math.min(eventsTotalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={eventsPage >= eventsTotalPages}>Next</button>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
                  <div className="flex items-center gap-3">
                    <select
                      value={''}
                      onChange={(e) => { }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <select
                      value={10}
                      onChange={(e) => { }}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event / Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(bookings || []).map((b) => (
                        <tr key={b.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.user?.name}<div className="text-gray-500 text-xs">{b.user?.email}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.items?.[0]?.eventTitle} ({b.items?.length} items)</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatPrice(b.totalAmount || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : b.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{b.status}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(b.bookingDate).toLocaleString('en-ZA')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => { }}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={true}
                  >Prev</button>
                  <span className="text-sm text-gray-600">Page 1 of 1</span>
                  <button
                    onClick={() => { }}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={true}
                  >Next</button>
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