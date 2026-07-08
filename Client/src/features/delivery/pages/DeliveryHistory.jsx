import Error from "../../../components/common/Error";
import Loading from "../../../components/common/Loading";
import DeliveryOrderCard from "../components/DeliveryOrderCard";
import { useDeliveryOrders } from "../apis/useDelivery";

const DeliveryHistory = () => {
  const { data: orders = [], isLoading, error } = useDeliveryOrders();

  if (isLoading) return <Loading text="Loading delivery history..." />;
  if (error) return <Error error={error} />;

  const completedOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">Order History</h2>
        <p className="text-on-surface-variant">
          Completed deliveries assigned to your account.
        </p>
      </div>

      {completedOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant bg-white p-10 text-center text-on-surface-variant">
          No completed deliveries yet.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {completedOrders.map((order) => (
            <DeliveryOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
