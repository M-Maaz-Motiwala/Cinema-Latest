// store.js

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice'; // Import authSlice

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer, // Add auth reducer
  },
});
