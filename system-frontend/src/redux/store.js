import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventsSlice from './slices/eventsSlice';
import cartSlice from './slices/cartSlice';
import ticketsSlice from './slices/ticketsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventsSlice,
    cart: cartSlice,
    tickets: ticketsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

