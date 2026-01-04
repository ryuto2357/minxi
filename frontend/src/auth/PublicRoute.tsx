import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";

function PublicRoute({ children }: { children: JSX.Element }) {
  const { loading } = useAuth();
  const token = localStorage.getItem("accessToken");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (token) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}

export default PublicRoute;
