"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser, getCurrentUser } from '../app/services/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const USER_KEY = 'authUser';

const saveUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const loadUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('authToken');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        setUser(null);
        clearUser();
        setLoading(false);
        return;
      }

      // If we already have a cached user, mark as loaded immediately
      // and silently refresh in background
      const cached = loadUser();
      if (cached) {
        setUser(cached);
        setLoading(false);
      }

      // Try to refresh user from server
      const response = await getCurrentUser();
      if (response && response.success && response.data) {
        setUser(response.data);
        saveUser(response.data);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        // Token is genuinely invalid — clear everything
        clearUser();
        setUser(null);
      }
      // For other errors (network, 500), keep the cached user
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await loginUser(username, password);

      if (response && response.success && response.client) {
        setUser(response.client);
        saveUser(response.client);
        router.push('/');
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore
    } finally {
      clearUser();
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
