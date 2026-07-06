import DeliveryProtectedRoute from "./DeliveryProtectedRoute";

const DeliveryRoute = ({ children }) => {
  return <DeliveryProtectedRoute>{children}</DeliveryProtectedRoute>;
};

export default DeliveryRoute;
