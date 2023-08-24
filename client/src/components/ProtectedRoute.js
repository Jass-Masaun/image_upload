// ProtectedRoute.js
import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
