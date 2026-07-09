import RoleProtectedRoute from "../../../components/RoleProtectedRoute";

const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      {children}
    </RoleProtectedRoute>
  );
};

export default AdminRoute;
