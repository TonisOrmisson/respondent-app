import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../store/authStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useAuthStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: true,
    });
  });

  describe('setAuth', () => {
    it('should set authentication state and save to storage', async () => {
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const mockToken = 'mock-token';

      await useAuthStore.getState().setAuth(mockToken, mockUser);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe(mockToken);
      expect(state.user).toBe(mockUser);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify(mockUser));
    });

    it('should handle storage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const mockToken = 'mock-token';

      await useAuthStore.getState().setAuth(mockToken, mockUser);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to save auth data:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('clearAuth', () => {
    it('should clear authentication state and remove from storage', async () => {
      // Set initial state
      useAuthStore.setState({
        isAuthenticated: true,
        token: 'token',
        user: { id: '1', phoneNumber: '+1234567890' },
      });

      await useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
    });

    it('should handle storage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await useAuthStore.getState().clearAuth();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear auth data:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('loadAuthFromStorage', () => {
    it('should load authentication state from storage', async () => {
      const mockUser = { id: '1', phoneNumber: '+1234567890' };
      const mockToken = 'mock-token';

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(JSON.stringify(mockUser));

      await useAuthStore.getState().loadAuthFromStorage();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle missing storage data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().loadAuthFromStorage();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle storage errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await useAuthStore.getState().loadAuthFromStorage();

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load auth data:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);

      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
    });
  });
});