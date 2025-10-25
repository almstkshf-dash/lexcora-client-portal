import api from './axiosInstance';

/**
 * Get all requests for the authenticated client
 */
export const getClientRequests = async () => {
  try {
    const response = await api.get('/client-auth/requests');
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
    const response = await api.post('/client-auth/requests', requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
