import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/authService";

export default function ProtectedRoute({ roles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (roles && !roles.includes(user?.role)) {
    // Send the user to their own dashboard instead of the landing page
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "tutor")
      return <Navigate to="/tutor/dashboard" replace />;
    if (user?.role === "student")
      return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
