import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/authService";

export default function ProtectedRoute({ roles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}