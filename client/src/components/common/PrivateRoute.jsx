// client/src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While the context is checking for a token, we can show a loading state
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child component (the protected page)
  return children;
};

export default PrivateRoute;