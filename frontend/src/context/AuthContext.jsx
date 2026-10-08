import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial mount
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('mrittika_token');
      const savedUser = localStorage.getItem('mrittika_user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            // ignore
          }
        }
        // Verify token with backend
        try {
          const verifiedUser = await authApi.getCurrentUser();
          if (verifiedUser) {
            setUser(verifiedUser);
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          // Only clear if 401 unauthorized
          if (err.status === 401) {
            authApi.logout();
            setUser(null);
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      setToken(res.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, language = 'en') => {
    setLoading(true);
    try {
      await authApi.signup(name, email, password, language);
      // Auto-login after successful registration
      const loginRes = await authApi.login(email, password);
      setUser(loginRes.user);
      setToken(loginRes.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = async (updatedFields) => {
    if (updatedFields.language && updatedFields.language !== user?.language) {
      try {
        await authApi.updateLanguage(updatedFields.language);
      } catch (err) {
        console.warn('Failed to update language on backend:', err.message);
      }
    }
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

export default AuthContext;
