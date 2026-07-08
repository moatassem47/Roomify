import RoleProtectedRoute from "../../../components/common/RoleProtectedRoute";

const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      {children}
    </RoleProtectedRoute>
  );
};

export default AdminRoute;
