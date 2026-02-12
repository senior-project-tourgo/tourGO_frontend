// 👇 MUST be at the very top before imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  clearAuthData
} from './storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Storage Utility', () => {
  const TOKEN_KEY = 'userToken';
  const USER_KEY = 'userData';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // TOKEN TESTS
  // =========================

  describe('Token Functions', () => {
    it('should save token', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null);

      await saveToken('abc123');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(TOKEN_KEY, 'abc123');
    });

    it('should get token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('abc123');

      const token = await getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
      expect(token).toBe('abc123');
    });

    it('should return null if getToken fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());

      const token = await getToken();

      expect(token).toBeNull();
    });

    it('should remove token', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(null);

      await removeToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });

  // =========================
  // USER TESTS
  // =========================

  describe('User Functions', () => {
    const mockUser = { id: 1, name: 'John' };

    it('should save user', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null);

      await saveUser(mockUser);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        USER_KEY,
        JSON.stringify(mockUser)
      );
    });

    it('should get user', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUser)
      );

      const user = await getUser();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(USER_KEY);
      expect(user).toEqual(mockUser);
    });

    it('should return null if no user data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const user = await getUser();

      expect(user).toBeNull();
    });

    it('should return null if getUser fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error());

      const user = await getUser();

      expect(user).toBeNull();
    });

    it('should remove user', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(null);

      await removeUser();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(USER_KEY);
    });
  });

  // =========================
  // CLEAR AUTH
  // =========================

  describe('clearAuthData', () => {
    it('should remove both token and user data', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValueOnce(null);

      await clearAuthData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        TOKEN_KEY,
        USER_KEY
      ]);
    });
  });
});
