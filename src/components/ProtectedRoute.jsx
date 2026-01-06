import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");
  const isAuth = localStorage.getItem("isAuth") === "true";

  // Check if the user is authenticated
  if (!isAuth || !userRole) {
    // Redirect to root or login if no session exists
    return <Navigate to="/" replace />;
  }

  // Check if the user's role is permitted to access this specific route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to unauthorized or home if the role doesn't match
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;