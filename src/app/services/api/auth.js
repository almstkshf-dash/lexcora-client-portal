import api from './axiosInstance';

/**
 * Login user with username and password
 */
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/client-auth/login', {
      username,
      password
    });
    
    // Save token to localStorage if login is successful
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
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
    const response = await api.post('/client-auth/logout');
    
    // Clear token from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    
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
    const response = await api.get('/client-auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};
