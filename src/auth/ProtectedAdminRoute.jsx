import React from "react";
import { Navigate } from "react-router-dom";
import { getAdminToken } from "./authStore";

export default function ProtectedAdminRoute({ children }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
