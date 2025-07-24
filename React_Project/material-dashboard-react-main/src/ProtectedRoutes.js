import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, hasPermission } = useAuth();

  if (!user) return <Navigate to="/authentication/sign-in" replace />;

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />; // replace with some unauthorized page if needed
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
};

export default ProtectedRoute;
