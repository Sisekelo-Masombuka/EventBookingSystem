import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7037/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunk for downloading ticket PDF
export const downloadTicket = createAsyncThunk(
  'tickets/downloadTicket',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/bookings/${bookingId}/ticket`,
        {
          headers: getAuthHeaders(),
          responseType: 'blob', // Important for PDF download
        }
      );
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, bookingId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download ticket');
    }
  }
);

const initialState = {
  downloading: false,
  error: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Download Ticket
      .addCase(downloadTicket.pending, (state) => {
        state.downloading = true;
        state.error = null;
      })
      .addCase(downloadTicket.fulfilled, (state, action) => {
        state.downloading = false;
        state.error = null;
      })
      .addCase(downloadTicket.rejected, (state, action) => {
        state.downloading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = ticketsSlice.actions;
export default ticketsSlice.reducer;


