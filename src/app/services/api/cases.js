import api from './axiosInstance';

export const getClientCases = async () => {
  try {
    const response = await api.get('/client-auth/cases');
    const body = response.data;
    // res.success() shape: { success, data: [...], stats, pagination }
    return {
      success: body.success,
      data: Array.isArray(body.data) ? body.data : [],
      stats: body.stats || { total: 0, active: 0, pending: 0, important: 0 },
      message: body.message,
    };
  } catch (error) {
    throw error;
  }
};

export const getClientCaseById = async (caseId) => {
  try {
    const response = await api.get(`/client-auth/cases/${caseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClientDocuments = async () => {
  try {
    const response = await api.get('/client-auth/documents');
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

export const uploadDocument = async (formData) => {
  try {
    const response = await api.post('/client-auth/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
