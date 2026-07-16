import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_PLATFORM_SETTINGS, readCachedPlatformSettings, subscribeToPlatformSettings } from "../admin/adminService";
import {
  platformSettingsFailed,
  platformSettingsReceived,
} from "./platformSettingsSlice";

export default function usePlatformSettings() {
  const dispatch = useDispatch();
  const platformSettings = useSelector((state) => state.platformSettings.data);

  useEffect(() => {
    return subscribeToPlatformSettings(
      (settings) => dispatch(platformSettingsReceived(settings)),
      (error) => {
        dispatch(platformSettingsFailed(error.message));
        dispatch(platformSettingsReceived({
          ...DEFAULT_PLATFORM_SETTINGS,
          ...readCachedPlatformSettings(),
        }));
      },
    );
  }, [dispatch]);

  return platformSettings;
}
