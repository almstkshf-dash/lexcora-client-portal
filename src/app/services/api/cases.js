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

/**
 * Upload a document for the authenticated client
 */
export const uploadDocument = async (formData) => {
  try {
    const response = await api.post('/client-auth/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
