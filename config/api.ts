import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/**
 * Axios instance for API calls
 * Automatically includes JWT token in Authorization header if available
 */
const api = axios.create({
  baseURL: 'http://172.20.10.2:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor to add JWT token to headers
 * Runs before every request is sent
 */
api.interceptors.request.use(
  async config => {
    try {
      // Get token from storage
      const token = await AsyncStorage.getItem('userToken');

      if (token) {
        // Add token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 * Runs after every response is received
 */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
