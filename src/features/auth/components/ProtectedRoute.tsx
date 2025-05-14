import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../../services/auth";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; 
}
const ProtectedRoute = ({ children,allowedRoles}: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole || "")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute; 
