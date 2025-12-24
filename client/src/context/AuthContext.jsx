import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
  if (!token) return;

  const res = await fetch("http://localhost:8080/api/user/auth/me", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.ok) {
    const data = await res.json();
    setAuthData(token, data);
  }
};

  useEffect(() => {
    let storedToken = localStorage.getItem("token");
    let storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsReady(true);
  }, []);

  const setAuthData = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);

    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = null;
    }

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

    const contextValue = { token, user, isReady, setAuthData, setToken, setUser, refreshUser };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
