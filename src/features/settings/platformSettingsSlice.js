import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PLATFORM_SETTINGS, readCachedPlatformSettings } from '../admin/adminService';

const initialState = {
  data: {
    ...DEFAULT_PLATFORM_SETTINGS,
    ...readCachedPlatformSettings(),
  },
  loading: false,
  error: null,
};

const platformSettingsSlice = createSlice({
  name: 'platformSettings',
  initialState,
  reducers: {
    platformSettingsLoading(state) {
      state.loading = true;
      state.error = null;
    },
    platformSettingsReceived(state, action) {
      state.loading = false;
      state.data = {
        ...DEFAULT_PLATFORM_SETTINGS,
        ...action.payload,
      };
      state.error = null;
    },
    platformSettingsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    platformSettingsUpdated(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.error = null;
    },
    influencerCommissionUpdated(state, action) {
      const { influencerUid, data } = action.payload;
      state.data.influencerCommissions = {
        ...(state.data.influencerCommissions || {}),
        [influencerUid]: data,
      };
      state.error = null;
    },
  },
});

export const {
  platformSettingsLoading,
  platformSettingsReceived,
  platformSettingsFailed,
  platformSettingsUpdated,
  influencerCommissionUpdated,
} = platformSettingsSlice.actions;

export default platformSettingsSlice.reducer;
