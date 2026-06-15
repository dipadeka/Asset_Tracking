import React, { createContext, useContext, useState } from "react";
import { emrsLogin } from "../api/emrsAuthApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("emrs_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    try {
      const data = await emrsLogin(username, password);
      setUser(data.user);
      localStorage.setItem("emrs_current_user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("emrs_token", data.token);
      }
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Invalid username or password",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("emrs_current_user");
    localStorage.removeItem("emrs_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;
