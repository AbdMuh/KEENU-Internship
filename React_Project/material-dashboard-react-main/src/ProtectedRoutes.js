// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "AuthProvider";

function ProtectedRoute({ children }) {
  // const { user } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("ProtectedRoute called with user:", user);

  return user ? children : <Navigate to="/authentication/sign-in" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
