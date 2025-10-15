import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://eventbookingsystem-production-7385.up.railway.app/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/favorites`, { headers: getAuthHeaders() });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (eventId, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/favorites/${eventId}`, null, { headers: getAuthHeaders() });
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (eventId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/favorites/${eventId}`, { headers: getAuthHeaders() });
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addFavorite.fulfilled, (state, action) => {
        // Optimistic: just push placeholder; real list refresh recommended
        state.items.push({ eventId: action.payload });
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(f => f.eventId !== action.payload);
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
