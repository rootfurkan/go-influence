import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialized: false,
  loading: false,
  user: null,
  profile: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading(state) {
      state.loading = true;
      state.error = null;
    },
    authReady(state, action) {
      state.initialized = true;
      state.loading = false;
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.error = null;
    },
    authFailed(state, action) {
      state.initialized = true;
      state.loading = false;
      state.error = action.payload;
    },
    authCleared(state) {
      state.initialized = true;
      state.loading = false;
      state.user = null;
      state.profile = null;
      state.error = null;
    },
  },
});

export const { authLoading, authReady, authFailed, authCleared } = authSlice.actions;
export default authSlice.reducer;
