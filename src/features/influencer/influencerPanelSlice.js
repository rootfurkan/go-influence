import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeScreen: 'dashboard',
  searchQuery: '',
  offers: [],
  needs: [],
  chatThreads: [],
  profile: null,
  toasts: [],
};

const influencerPanelSlice = createSlice({
  name: 'influencerPanel',
  initialState,
  reducers: {
    setInfluencerActiveScreen(state, action) {
      state.activeScreen = action.payload;
    },
    setInfluencerSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setInfluencerOffers(state, action) {
      state.offers = action.payload;
    },
    setInfluencerNeeds(state, action) {
      state.needs = action.payload;
    },
    setInfluencerChatThreads(state, action) {
      state.chatThreads = action.payload;
    },
    setInfluencerProfile(state, action) {
      state.profile = action.payload;
    },
    addInfluencerToast(state, action) {
      state.toasts.push(action.payload);
    },
    removeInfluencerToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearInfluencerToasts(state) {
      state.toasts = [];
    },
  },
});

export const {
  setInfluencerActiveScreen,
  setInfluencerSearchQuery,
  setInfluencerOffers,
  setInfluencerNeeds,
  setInfluencerChatThreads,
  setInfluencerProfile,
  addInfluencerToast,
  removeInfluencerToast,
  clearInfluencerToasts,
} = influencerPanelSlice.actions;

export default influencerPanelSlice.reducer;
