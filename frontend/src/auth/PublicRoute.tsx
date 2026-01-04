import type { JSX } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/feed" replace />;
    }

    return children;
}

export default PublicRoute;