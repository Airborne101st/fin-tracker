// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "./Auth";

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
