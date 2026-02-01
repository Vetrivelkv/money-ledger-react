import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { PATHS } from "../routes/paths";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return children;
}
