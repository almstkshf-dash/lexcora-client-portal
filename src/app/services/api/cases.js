import api from './axiosInstance';

/**
 * Get all cases for the authenticated client
 */
export const getClientCases = async () => {
  try {
    const response = await api.get('/client-auth/cases');
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
    const response = await api.get(`/client-auth/cases/${caseId}`);
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
    const response = await api.get('/client-auth/documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};
