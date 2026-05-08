import api from './axiosInstance';

const extractToken = (data, headers) => {
  const bodyToken =
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    null;

  if (bodyToken) {
    return bodyToken;
  }

  const headerAuth = headers?.authorization || headers?.Authorization;
  if (typeof headerAuth === 'string') {
    const parts = headerAuth.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
    return headerAuth;
  }

  return null;
};

const extractUser = (data) => {
  return (
    data?.client ||
    data?.user ||
    data?.data?.client ||
    data?.data?.user ||
    data?.data ||
    data?.clientData ||
    data?.userData ||
    null
  );
};

/**
 * Login user with username and password
 */
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/client-auth/login', {
      username,
      password,
    });

    const body = response.data;
    const token = extractToken(body, response.headers);
    const user = extractUser(body);

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }

    return {
      success: body?.success ?? !!token,
      message: body?.message || null,
      token,
      user,
      raw: body,
    };
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
