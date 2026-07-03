import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

// Decode a JWT payload without any extra dependency
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const logout = useCallback((silent = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (!silent) toast.info('You have been logged out');
  }, []);

  // Auto logout when JWT expires
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const expiresInMs = decoded.exp * 1000 - Date.now();

    if (expiresInMs <= 0) {
      logout(true);
      return;
    }

    const timer = setTimeout(() => {
      toast.warn('Session expired. Please log in again.');
      logout(true);
    }, expiresInMs);

    return () => clearTimeout(timer);
  }, [user, logout]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginUser(credentials);
      const { token, ...userInfo } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      toast.success(`Welcome back, ${userInfo.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await registerUser(payload);
      const { token, ...userInfo } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Registration failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStoredUser = (userInfo) => {
    const merged = { ...user, ...userInfo };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateStoredUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
