import RoleProtectedRoute from "../../../components/common/RoleProtectedRoute";

const DeliveryProtectedRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["delivery"]}>
      {children}
    </RoleProtectedRoute>
  );
};

export default DeliveryProtectedRoute;
