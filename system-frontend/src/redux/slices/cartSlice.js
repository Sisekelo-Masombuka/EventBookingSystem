import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://eventbookingsystem-production-7385.up.railway.app/api';

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

// Process card payment
export const processCardPayment = createAsyncThunk(
  'cart/processCardPayment',
  async ({ paymentId, card }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/card`,
        {
          paymentId,
          cardholderName: card.cardholderName,
          cardNumber: card.cardNumber.replace(/\s/g, ''),
          expiryDate: card.expiryDate,
          CVV: card.cvv,
        },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Card payment failed');
    }
  }
);

// Generate Money Market details
export const generateMoneyMarket = createAsyncThunk(
  'cart/generateMoneyMarket',
  async ({ paymentId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/money`,
        { paymentId },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate Money Market details');
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
  lastCheckout: null,
  moneyMarket: null,
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
        // The component can dispatch fetchCart after this
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
        const payload = action.payload;
        // Backend returns either { cart: null } when empty or the cart object directly when present
        state.cart = payload && payload.cart !== undefined ? payload.cart : (payload && payload.bookingId ? payload : null);
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
        state.lastCheckout = action.payload; // Contains paymentId, referenceCode, amount, paymentMethod
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

    // Payments
    builder
      .addCase(processCardPayment.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(processCardPayment.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.cart = null;
      })
      .addCase(processCardPayment.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload;
      })
      .addCase(generateMoneyMarket.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(generateMoneyMarket.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.moneyMarket = action.payload;
      })
      .addCase(generateMoneyMarket.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload;
      });
  },
});

export const { clearError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

