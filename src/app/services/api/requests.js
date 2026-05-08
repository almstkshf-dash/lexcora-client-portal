import api from './axiosInstance';

export const getClientRequests = async () => {
  try {
    const response = await api.get('/client-auth/requests');
    const body = response.data;
    return {
      success: body.success,
      data: Array.isArray(body.data) ? body.data : [],
      message: body.message,
    };
  } catch (error) {
    throw error;
  }
};

export const createClientRequest = async (requestData) => {
  try {
    const response = await api.post('/client-auth/requests', requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
