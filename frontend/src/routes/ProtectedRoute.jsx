import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * Wrap any route element that requires a logged-in user:
 *
 *   <Route
 *     path="/dashboard/*"
 *     element={
 *       <ProtectedRoute>
 *         <Dashboard />
 *       </ProtectedRoute>
 *     }
 *   />
 *
 * Redirects unauthenticated users to /login, remembering where
 * they were headed so we can send them back after login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // could render a splash/spinner here

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
