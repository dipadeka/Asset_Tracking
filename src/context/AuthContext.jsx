import React, { createContext, useContext, useState } from "react";
import { authenticateUser } from "../pages/EMRS/Schoolcredentials";
 
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
 
  const login = (username, password) => {
    const found = authenticateUser(username, password);
    if (found) {
      setUser(found);
      localStorage.setItem("emrs_current_user", JSON.stringify(found));
      return { success: true, user: found };
    }
    return { success: false, error: "Invalid username or password" };
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem("emrs_current_user");
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