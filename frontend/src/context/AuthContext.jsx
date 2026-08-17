import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "infosys_springboard_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.log(err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const loggedInUser = await loginRequest(email, password);

    setUser(loggedInUser);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(loggedInUser)
    );

    return loggedInUser;
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem(STORAGE_KEY);

    sessionStorage.clear();
  };

  // Update profile after editing
  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}