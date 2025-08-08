// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null, // We can add user data here later
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // In a full app, you would verify the token with the backend here
      // For now, we'll assume the token is valid if it exists
      setAuth(prev => ({ ...prev, isAuthenticated: true, loading: false }));
    } else {
      setAuth(prev => ({ ...prev, isAuthenticated: false, loading: false }));
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
    setAuth({
      token: response.data.token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const register = async (name, email, password) => {
    const response = await authService.register({ name, email, password });
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
    setAuth({
      token: response.data.token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};