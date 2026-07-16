import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 'home',
  preselectedRole: '',
  currentUser: null,
  showWelcomeMessage: false,
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    setLandingPage(state, action) {
      state.currentPage = action.payload;
    },
    setPreselectedRole(state, action) {
      state.preselectedRole = action.payload;
    },
    clearPreselectedRole(state) {
      state.preselectedRole = '';
    },
    setLandingUser(state, action) {
      state.currentUser = action.payload;
    },
    clearLandingUser(state) {
      state.currentUser = null;
      state.showWelcomeMessage = false;
    },
    showLandingWelcome(state) {
      state.showWelcomeMessage = true;
    },
    hideLandingWelcome(state) {
      state.showWelcomeMessage = false;
    },
  },
});

export const {
  setLandingPage,
  setPreselectedRole,
  clearPreselectedRole,
  setLandingUser,
  clearLandingUser,
  showLandingWelcome,
  hideLandingWelcome,
} = landingSlice.actions;

export default landingSlice.reducer;
