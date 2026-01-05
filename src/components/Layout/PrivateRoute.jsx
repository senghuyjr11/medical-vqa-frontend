// src/components/Layout/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

export default function PrivateRoute({ children }) {
    const location = useLocation();
    const isAuthed = authService.isAuthenticated();

    if (!isAuthed) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
