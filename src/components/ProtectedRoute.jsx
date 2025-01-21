import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  // Si l'utilisateur n'est pas authentifié, on redirige vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on affiche le composant enfant
  return children;
};

export default ProtectedRoute;
