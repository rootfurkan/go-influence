import { createSlice } from '@reduxjs/toolkit';

const initialBrandProfile = {
  name: 'Trendyol',
  website: 'https://www.trendyol.com',
  description: "Türkiye'nin lider e-ticaret platformu ve teknoloji grubu.",
  size: '50+',
  location: 'İstanbul, Türkiye',
  logoUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBHm0lByZdOXAOPWNSoB0ZM-SY9JrP3VBbt76njg-BJDb7zbe9Fkh5K4eiI0HKPya4zj-CyXJw4pdpGZSwZKFFPbX1R0xk02wK_-voP3y3wzCFyo5zJZSuOvoUPPfa_ssvRdpOANWzuKhD6l7idIoGohzjXVqDXvIdcQQ76gm97n3Ns7_uzPs81ZEuyXh5SlrfzP1y5ci73und55BE87ilfJTPZBzmtkb_qO0ou4jzHQ9vGLCXCKKin',
  primaryColor: '#9000D7',
};

const initialState = {
  appMode: 'MAIN',
  brandProfile: initialBrandProfile,
  brandCategories: ['Moda'],
  brandBudget: 25000,
  onboardingSaving: false,
  currentTab: 'dashboard',
  searchQuery: '',
  mobileSidebarOpen: false,
  campaigns: [],
  offers: [],
  chatThreads: [],
  creators: [],
  activeChatThreadId: null,
  offerModalCreator: null,
};

const brandPanelSlice = createSlice({
  name: 'brandPanel',
  initialState,
  reducers: {
    setBrandAppMode(state, action) {
      state.appMode = action.payload;
    },
    updateBrandProfile(state, action) {
      state.brandProfile = { ...state.brandProfile, ...action.payload };
    },
    setBrandCategories(state, action) {
      state.brandCategories = action.payload;
    },
    setBrandBudget(state, action) {
      state.brandBudget = action.payload;
    },
    setBrandOnboardingSaving(state, action) {
      state.onboardingSaving = action.payload;
    },
    setBrandCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
    setBrandSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setBrandMobileSidebarOpen(state, action) {
      state.mobileSidebarOpen = action.payload;
    },
    toggleBrandMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    addBrandCampaign(state, action) {
      state.campaigns.unshift(action.payload);
      state.currentTab = 'matches';
    },
    setBrandCampaigns(state, action) {
      state.campaigns = action.payload;
    },
    setBrandCreators(state, action) {
      state.creators = action.payload;
    },
    setBrandOffers(state, action) {
      state.offers = action.payload;
    },
    updateBrandCampaign(state, action) {
      const index = state.campaigns.findIndex((campaign) => campaign.id === action.payload.id);
      if (index >= 0) {
        state.campaigns[index] = {
          ...state.campaigns[index],
          ...action.payload,
        };
      }
    },
    setBrandOfferModalCreator(state, action) {
      state.offerModalCreator = action.payload;
    },
    setActiveBrandChatThread(state, action) {
      state.activeChatThreadId = action.payload;
    },
    setBrandChatThreads(state, action) {
      state.chatThreads = action.payload;
      if (
        action.payload.length
        && !action.payload.some((thread) => thread.creatorId === state.activeChatThreadId)
      ) {
        state.activeChatThreadId = action.payload[0].creatorId;
      } else if (!action.payload.length) {
        state.activeChatThreadId = null;
      }
    },
    openBrandChat(state, action) {
      state.activeChatThreadId = action.payload;
      state.currentTab = 'messages';
    },
    addBrandChatMessage(state, action) {
      const { threadId, message, lastMessageText } = action.payload;
      const thread = state.chatThreads.find((item) => item.creatorId === threadId);
      if (!thread) return;

      thread.messages.push(message);
      thread.lastMessageText = lastMessageText;
      thread.lastMessageTime = 'Şimdi';
    },
  },
});

export const {
  setBrandAppMode,
  updateBrandProfile,
  setBrandCategories,
  setBrandBudget,
  setBrandOnboardingSaving,
  setBrandCurrentTab,
  setBrandSearchQuery,
  setBrandMobileSidebarOpen,
  toggleBrandMobileSidebar,
  addBrandCampaign,
  setBrandCampaigns,
  setBrandCreators,
  setBrandOffers,
  updateBrandCampaign,
  setBrandOfferModalCreator,
  setActiveBrandChatThread,
  setBrandChatThreads,
  openBrandChat,
  addBrandChatMessage,
} = brandPanelSlice.actions;

export default brandPanelSlice.reducer;
