import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { token, isReady } = useAuth();

  if (!isReady) return null;

  if (!token) {
    console.log("YOU WERE REDIRECTED SINCE NO AUTH");
    return <Navigate to="/login" replace />;
  }

  return children;
};
