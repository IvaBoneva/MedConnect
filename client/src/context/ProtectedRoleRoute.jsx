import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoleRoute = ({ children, allowedRoles = [] }) => {
  const { token, user, isReady } = useAuth();

  if (!isReady) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};
