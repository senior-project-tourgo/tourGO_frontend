import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '../config/api';
import { clearAuthData, getToken, getUser, saveToken, saveUser } from '../utils/storage';

/**
 * User data structure
 */
interface User {
    id: string;
    name: string;
    username: string;
    email?: string;
    phoneNumber?: string;
}

/**
 * Auth context value structure
 */
interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    register: (name: string, username: string, identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider Component
 * Manages authentication state for the entire app
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Check if user is already logged in on app start
     * Loads token and user data from storage
     */
    useEffect(() => {
        const loadAuthData = async () => {
            // TEMP: clear storage on every app start
            await clearAuthData();

            try {
                const storedToken = await getToken();
                const storedUser = await getUser();

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Error loading auth data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, []);

    /**
     * Register new user
     */
    const register = async (
        name: string,
        username: string,
        identifier: string,
        password: string
    ): Promise<void> => {
        try {
            const response = await api.post('/auth/register', {
                name,
                username,
                identifier,
                password,
            });

            const { token: newToken, user: newUser } = response.data.data;

            // Save to storage
            await saveToken(newToken);
            await saveUser(newUser);

            // Update state
            setToken(newToken);
            setUser(newUser);
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    };

    /**
     * Login user
     */
    const login = async (identifier: string, password: string): Promise<void> => {
        try {
            const response = await api.post('/auth/login', {
                identifier,
                password,
            });

            const { token: newToken, user: newUser } = response.data.data;

            // Save to storage
            await saveToken(newToken);
            await saveUser(newUser);

            // Update state
            setToken(newToken);
            setUser(newUser);
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(
                error.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        }
    };

    /**
     * Logout user
     */
    const logout = async (): Promise<void> => {
        try {
            // Clear storage
            await clearAuthData();

            // Clear state
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Logout failed. Please try again.');
        }
    };

    const value: AuthContextValue = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * Must be used within AuthProvider
 */
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
