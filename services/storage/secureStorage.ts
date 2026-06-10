import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

export const secureStorageService: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(name);
      } catch (e) {
        console.error('Failed to get item from localStorage:', e);
        return null;
      }
    }
    try {
      return await SecureStore.getItemAsync(name);
    } catch (e) {
      console.error('Failed to get item from SecureStore:', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        console.error('Failed to set item in localStorage:', e);
      }
      return;
    }
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (e) {
      console.error('Failed to set item in SecureStore:', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(name);
      } catch (e) {
        console.error('Failed to remove item from localStorage:', e);
      }
      return;
    }
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (e) {
      console.error('Failed to delete item from SecureStore:', e);
    }
  },
};
