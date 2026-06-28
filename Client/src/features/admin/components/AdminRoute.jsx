import { Navigate } from "react-router-dom";
import useAuth from "../../../store/authStore";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;