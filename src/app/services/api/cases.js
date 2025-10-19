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
 * Get all cases for the authenticated client
 */
export const getClientCases = async () => {
  try {
    const response = await apiClient.get('/client-auth/cases');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get specific case details by ID
 */
export const getClientCaseById = async (caseId) => {
  try {
    const response = await apiClient.get(`/client-auth/cases/${caseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all documents for the authenticated client
 */
export const getClientDocuments = async () => {
  try {
    const response = await apiClient.get('/client-auth/documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};
