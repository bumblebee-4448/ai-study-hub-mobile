import { Platform } from "react-native";

import { secureStorageService } from "@/services/storage/secureStorage";

const DEVICE_ID_STORAGE_KEY = "auth-device-id";

const createDeviceId = () =>
  `mobile-${Platform.OS}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;

export const getOrCreateDeviceId = async () => {
  const existingDeviceId = await secureStorageService.getItem(
    DEVICE_ID_STORAGE_KEY
  );

  if (existingDeviceId) {
    return existingDeviceId;
  }

  const deviceId = createDeviceId();
  await secureStorageService.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
};
