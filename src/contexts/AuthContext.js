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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await getCurrentUser();
      if (response && response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      // Only clear the token if it's explicitly invalid (401)
      // Do NOT clear on network errors or cold-start failures
      const status = err?.response?.status;
      if (status === 401) {
        if (typeof window !== 'undefined') localStorage.removeItem('authToken');
        setUser(null);
      }
      // For any other error (500, network), keep the token and stay logged in
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
        router.push('/'); // Redirect to home page
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
      // ignore logout API errors
    } finally {
      if (typeof window !== 'undefined') localStorage.removeItem('authToken');
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
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
