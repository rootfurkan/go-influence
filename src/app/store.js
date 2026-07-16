import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice';
import platformSettingsReducer from '../features/settings/platformSettingsSlice';
import landingReducer from '../features/landing/landingSlice';
import brandPanelReducer from '../features/brand/brandPanelSlice';
import influencerPanelReducer from '../features/influencer/influencerPanelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    platformSettings: platformSettingsReducer,
    landing: landingReducer,
    brandPanel: brandPanelReducer,
    influencerPanel: influencerPanelReducer,
  },
});
