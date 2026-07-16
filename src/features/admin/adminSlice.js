import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'dashboard',
  searchQuery: '',
  toast: {
    message: '',
    isVisible: false,
  },
  isCampaignModalOpen: false,
  campaigns: [],
  selectedCampaignId: null,
  campaignOffers: [],
  pendingApprovals: [],
  brandUsers: [],
  influencerUsers: [],
  logs: [],
  transactions: [],
  approvedInfluencers: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
      state.searchQuery = '';
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    showAdminToast(state, action) {
      state.toast.message = action.payload;
      state.toast.isVisible = true;
    },
    hideAdminToast(state) {
      state.toast.isVisible = false;
    },
    setCampaignModalOpen(state, action) {
      state.isCampaignModalOpen = action.payload;
    },
    setPendingApprovals(state, action) {
      state.pendingApprovals = action.payload;
    },
    setApprovedInfluencers(state, action) {
      state.approvedInfluencers = action.payload;
    },
    addInfluencerUser(state, action) {
      state.influencerUsers.unshift(action.payload);
    },
    addLog(state, action) {
      state.logs.unshift(action.payload);
    },
    updateBrandUsers(state, action) {
      state.brandUsers = action.payload;
    },
    updateInfluencerUsers(state, action) {
      state.influencerUsers = action.payload;
    },
    addCampaign(state, action) {
      state.campaigns.unshift(action.payload);
      state.selectedCampaignId = action.payload.id;
    },
    setCampaigns(state, action) {
      state.campaigns = action.payload;
      if (!state.selectedCampaignId && action.payload.length) {
        state.selectedCampaignId = action.payload[0].id;
      }
    },
    setSelectedCampaignId(state, action) {
      state.selectedCampaignId = action.payload;
    },
    setCampaignOffers(state, action) {
      state.campaignOffers = action.payload;
    },
    updateCampaignOfferStatus(state, action) {
      const { id, status } = action.payload;
      const offer = state.campaignOffers.find((item) => item.id === id);
      if (offer) offer.status = status;
    },
    updateTransactions(state, action) {
      state.transactions = action.payload;
    },
    updateTransactionStatus(state, action) {
      const { id, status } = action.payload;
      const transaction = state.transactions.find((item) => item.id === id);
      if (transaction) transaction.status = status;
    },
    updatePendingTransactionCommission(state, action) {
      const { rate } = action.payload;
      state.transactions = state.transactions.map((transaction) => (
        transaction.status === 'Pending' ? { ...transaction, feePercent: rate } : transaction
      ));
    },
  },
});

export const {
  setActiveTab,
  setSearchQuery,
  showAdminToast,
  hideAdminToast,
  setCampaignModalOpen,
  setPendingApprovals,
  setApprovedInfluencers,
  addInfluencerUser,
  addLog,
  updateBrandUsers,
  updateInfluencerUsers,
  addCampaign,
  setCampaigns,
  setSelectedCampaignId,
  setCampaignOffers,
  updateCampaignOfferStatus,
  updateTransactions,
  updateTransactionStatus,
  updatePendingTransactionCommission,
} = adminSlice.actions;

export default adminSlice.reducer;
