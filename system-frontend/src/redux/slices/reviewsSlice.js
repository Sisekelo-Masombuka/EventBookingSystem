import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://eventbookingsystem-production-7385.up.railway.app/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEventReviews = createAsyncThunk(
  'reviews/fetchEventReviews',
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reviews/event/${eventId}`);
      return { eventId, data: res.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const upsertReview = createAsyncThunk(
  'reviews/upsertReview',
  async ({ eventId, rating, comment }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/reviews`, { eventId, rating, comment }, { headers: getAuthHeaders() });
      // refetch after upsert
      const res = await axios.get(`${API_BASE_URL}/reviews/event/${eventId}`);
      return { eventId, data: res.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

const initialState = {
  byEvent: {}, // eventId -> { averageRating, count, reviews }
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEventReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.byEvent[action.payload.eventId] = action.payload.data;
      })
      .addCase(fetchEventReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(upsertReview.fulfilled, (state, action) => {
        state.byEvent[action.payload.eventId] = action.payload.data;
      });
  }
});

export const { clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
