import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const { isAuthenticated: isAuthFromContext } = useContext(AuthContext);

  if (!isAuthFromContext) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
