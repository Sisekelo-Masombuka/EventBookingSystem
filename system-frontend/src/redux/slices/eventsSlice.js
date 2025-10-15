import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7037/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

export const fetchCities = createAsyncThunk(
  'events/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/cities`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cities');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  cities: [],
  categories: [],
  filters: {
    city: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        city: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Cities
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearCurrentEvent, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;

