import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  phoneNumber: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuthFromStorage: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: true,

  setAuth: async (token: string, user: User) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      set({ isAuthenticated: true, token, user });
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  },

  clearAuth: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      set({ isAuthenticated: false, token: null, user: null });
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  },

  loadAuthFromStorage: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        set({ isAuthenticated: true, token, user });
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
