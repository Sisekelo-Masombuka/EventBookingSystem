import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7037/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchOverview = createAsyncThunk(
  'admin/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/overview`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin overview');
    }
  }
);

export const fetchAdminBookings = createAsyncThunk(
  'admin/fetchBookings',
  async ({ page = 1, pageSize = 20, status = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/bookings`, {
        params: { page, pageSize, status: status || undefined },
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

const initialState = {
  overview: null,
  bookings: [],
  pagination: { currentPage: 1, pageSize: 20, totalCount: 0, totalPages: 0 },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOverview.fulfilled, (state, action) => { state.loading = false; state.overview = action.payload; })
      .addCase(fetchOverview.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAdminBookings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;



