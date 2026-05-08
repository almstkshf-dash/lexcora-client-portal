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
        setLoading(false);
        return;
      }

      // Restore cached user immediately so isAuthenticated is true
      const cached = loadUser();
      if (cached) {
        setUser(cached);
        setLoading(false);
      }

      // Silently refresh user from server in background
      const response = await getCurrentUser();
      if (response && response.success && response.data) {
        setUser(response.data);
        saveUser(response.data);
      }
    } catch (err) {
      // Do NOT clear the token here — the axios interceptor handles
      // real 401s on protected API calls. checkAuth failing (e.g. cold
      // start, network error) must never log the user out.
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await loginUser(username, password);
      const userPayload = response?.user || response?.client || response?.data || response?.clientData || response?.userData;

      if (response && response.success) {
        if (userPayload) {
          setUser(userPayload);
          saveUser(userPayload);
        } else {
          // Fallback: fetch current user after obtaining token
          const profileResponse = await getCurrentUser();
          const profile = profileResponse?.data || profileResponse?.client || profileResponse?.user;
          if (profile) {
            setUser(profile);
            saveUser(profile);
          }
        }

        router.push('/');
        return { success: true };
      } else {
        const message = response?.message || 'Login failed';
        setError(message);
        return { success: false, message };
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
