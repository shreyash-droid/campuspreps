"use client";

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/api';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    window.location.href = '/';
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          // If no user data, clear everything
          handleLogout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On error, clear auth state
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [handleLogout]);

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};