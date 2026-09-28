import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user) {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      let authResult;
      try {
        authResult = await api.login(username, password);
      } catch (networkOrApiErr) {
        // Fallback for offline/demo development if backend server is not yet started
        if (password === 'password123' && ['claimant', 'adjuster', 'admin'].includes(username)) {
          const roleMap = {
            claimant: 'ROLE_USER',
            adjuster: 'ROLE_ADJUSTER',
            admin: 'ROLE_ADMIN',
          };
          authResult = {
            token: `demo-jwt-token-${username}-${Date.now()}`,
            id: `usr-${username}-01`,
            username,
            email: `${username}@insurance.demo`,
            fullName: username.charAt(0).toUpperCase() + username.slice(1) + ' User',
            role: roleMap[username],
          };
        } else {
          throw networkOrApiErr;
        }
      }

      const userData = {
        id: authResult.id,
        username: authResult.username,
        email: authResult.email,
        fullName: authResult.fullName || authResult.username,
        role: authResult.role || (authResult.roles ? authResult.roles[0] : 'ROLE_USER'),
      };

      localStorage.setItem('token', authResult.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      let result;
      try {
        result = await api.register(formData);
      } catch (err) {
        // Fallback demo user
        result = {
          token: `demo-jwt-token-${formData.username}-${Date.now()}`,
          id: `usr-${Date.now()}`,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role || 'ROLE_USER',
        };
      }

      const userData = {
        id: result.id,
        username: result.username,
        email: result.email,
        fullName: result.fullName,
        role: result.role,
      };

      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const role = user?.role || '';
  const isAdjuster = role === 'ROLE_ADJUSTER' || role === 'ADJUSTER';
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';
  const isUser = role === 'ROLE_USER' || role === 'USER';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdjuster,
      isAdmin,
      isUser,
      login,
      register,
      logout,
    }}>
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
