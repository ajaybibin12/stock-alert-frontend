import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) {
      try {
        setUser(u ? JSON.parse(u) : null);
      } catch {
        setUser(null);
      }
    }
    setReady(true);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.access_token || res.data.token;
    localStorage.setItem("token", token);
    // optionally fetch profile
    const profile = res.data.user ?? (await api.get("/auth/me")).data;
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const register = async (email, password) => {
    await api.post("/auth/register", { email, password });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
