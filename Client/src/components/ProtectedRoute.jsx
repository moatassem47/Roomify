import RoleProtectedRoute from "./RoleProtectedRoute";
import { USER_ROLES } from "../utils/roleRoutes";

const ProtectedRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={USER_ROLES}>
      {children}
    </RoleProtectedRoute>
  );
};

export default ProtectedRoute;
