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
 * Get all requests for the authenticated client
 */
export const getClientRequests = async () => {
  try {
    const response = await apiClient.get('/client-auth/requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new request
 */
export const createClientRequest = async (requestData) => {
  try {
    const response = await apiClient.post('/client-auth/requests', requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
