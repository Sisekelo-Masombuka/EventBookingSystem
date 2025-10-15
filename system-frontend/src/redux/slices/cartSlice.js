import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7037/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartItem, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/add-to-cart`,
        cartItem,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/cart`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const checkout = createAsyncThunk(
  'cart/checkout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/checkout`,
        checkoutData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Checkout failed');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/bookings/cart/${bookingId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  cart: null,
  loading: false,
  error: null,
  checkoutLoading: false,
  checkoutError: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.checkoutError = null;
    },
    clearCartState: (state) => {
      state.cart = null;
      state.error = null;
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Refresh cart after adding item
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Checkout
      .addCase(checkout.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.cart = null; // Clear cart after successful checkout
        state.checkoutError = null;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
        state.error = null;
      });
  },
});

export const { clearError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

