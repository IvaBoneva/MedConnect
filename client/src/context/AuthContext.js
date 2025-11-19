// src/context/AuthContext.js
/*import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check for token in localStorage when app starts
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken_(storedToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
    }
    setIsReady(true);
  }, []);

  const setToken = (newToken) => {
    setToken_(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const contextValue = useMemo(() => ({ token, setToken, isReady }), [token, isReady]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;*/

// src/context/AuthContext.js
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null); // <-- store authenticated user

  useEffect(() => {
    let storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.warn("No token found in localStorage, user is not authenticated");
      setIsReady(true);
      return;
    }

    setToken_(storedToken);
    axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
    setIsReady(true);
  }, []);

  const setToken = (newToken) => {
    setToken_(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  // 🔹 NEW FUNCTION: refreshUser
  const refreshUser = async () => {
    try {
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/user/patient/me");
      // Replace /me with your backend endpoint that returns the current logged-in user

      if (res.status === 200) {
        setUser(res.data);
        // optional: keep in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const contextValue = useMemo(
    () => ({ token, setToken, isReady, user, setUser, refreshUser }),
    [token, isReady, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
