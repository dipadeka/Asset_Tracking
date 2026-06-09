import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
 
  if (!user) {
    // Not logged in → redirect to EMRS login
    return <Navigate to="/emrs/login" replace />;
  }
 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role → redirect to their correct dashboard
    return <Navigate to={user.role === "admin" ? "/dashboard/admin" : "/dashboard/emrs"} replace />;
  }
 
  return children;
};
 
export default ProtectedRoute;