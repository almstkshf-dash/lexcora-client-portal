import axios from 'axios';

// Base URL for API - adjust this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Login user with username and password
 */
export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post('/client-auth/login', {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/client-auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/client-auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};
