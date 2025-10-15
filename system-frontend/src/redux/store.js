import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import eventsSlice from './slices/eventsSlice';
import cartSlice from './slices/cartSlice';
import ticketsSlice from './slices/ticketsSlice';
import adminSlice from './slices/adminSlice';
import favoritesSlice from './slices/favoritesSlice';
import reviewsSlice from './slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventsSlice,
    cart: cartSlice,
    tickets: ticketsSlice,
    admin: adminSlice,
    favorites: favoritesSlice,
    reviews: reviewsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
