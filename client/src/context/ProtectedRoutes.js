import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { token, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !token) {
      navigate("/login");
    }
  }, [token, isReady, navigate]);

  if (!isReady || !token) {
    return <div>Loading...</div>;
  }

  return children;
};

