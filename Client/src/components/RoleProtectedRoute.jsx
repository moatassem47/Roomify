import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../store/authStore";
import { getRoleHome } from "../utils/roleRoutes";

const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const isAuthenticated = useAuth((s)=>s.isAuthenticated);
  const isCheckingAuth = useAuth((s)=>s.isCheckingAuth);
  const  user  = useAuth((s)=>s.user);
  const location = useLocation();
  
  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    if (!requireAuth) {
      return children;
    }
  
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
