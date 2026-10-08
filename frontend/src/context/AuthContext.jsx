import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial mount
    const savedToken = localStorage.getItem('mrittika_token');
    const savedUser = localStorage.getItem('mrittika_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('mrittika_user');
      }
    } else {
      // Default initial mock user for instant hackathon demonstration
      const defaultUser = authApi.getCurrentUser();
      setUser(defaultUser);
      setToken('mock_session_token_default');
      localStorage.setItem('mrittika_user', JSON.stringify(defaultUser));
      localStorage.setItem('mrittika_token', 'mock_session_token_default');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      setToken(res.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed. Please check credentials.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, language = 'English') => {
    setLoading(true);
    try {
      const res = await authApi.signup(name, email, password, language);
      setUser(res.user);
      setToken(res.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('mrittika_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
