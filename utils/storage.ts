import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for managing JWT token and user data
 * Uses AsyncStorage for persistent storage
 */

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

/**
 * Save JWT token to storage
 */
export const saveToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving token:', error);
        throw error;
    }
};

/**
 * Get JWT token from storage
 */
export const getToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

/**
 * Remove JWT token from storage (logout)
 */
export const removeToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
        throw error;
    }
};

/**
 * Save user data to storage
 */
export const saveUser = async (user: any): Promise<void> => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

/**
 * Get user data from storage
 */
export const getUser = async (): Promise<any | null> => {
    try {
        const userData = await AsyncStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

/**
 * Remove user data from storage (logout)
 */
export const removeUser = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error('Error removing user:', error);
        throw error;
    }
};

/**
 * Clear all authentication data (complete logout)
 */
export const clearAuthData = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
        console.error('Error clearing auth data:', error);
        throw error;
    }
};
