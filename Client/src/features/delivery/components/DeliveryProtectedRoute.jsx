import RoleProtectedRoute from "../../../components/RoleProtectedRoute";

const DeliveryProtectedRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["delivery"]}>
      {children}
    </RoleProtectedRoute>
  );
};

export default DeliveryProtectedRoute;
