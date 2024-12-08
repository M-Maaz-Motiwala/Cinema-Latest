// authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

// Thunk to log in the user
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, credentials);
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem("token", token);

            // Decode the token to extract user details
            const user = jwtDecode(token);

            return { user, token };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Thunk to load user details using the token
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue("No token available");

    try {
        // Decode token to get user details
        const user = jwtDecode(token);
        return user;
    } catch (error) {
        return rejectWithValue("Invalid token");
    }
});

// Thunk to register a new user
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, userData);
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem("token", token);

            // Decode the token to extract user details
            const user = jwtDecode(token);

            return { user, token };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Load user
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export logout action
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
