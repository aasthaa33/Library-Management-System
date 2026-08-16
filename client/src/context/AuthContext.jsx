// ...existing code...
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    try {
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", authToken);
      if (userData?.role) sessionStorage.setItem("role", userData.role);
    } catch (e) {
      console.error("Auth login storage error", e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
    } catch (e) {
      console.error("Auth logout storage error", e);
    }
  };

  useEffect(() => {
    // sessionStorage is tab-isolated, no cross-tab sync needed
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
//