import Error from "../../../components/Error";
import Loading from "../../../components/Loading";
import DeliveryOrderCard from "../components/DeliveryOrderCard";
import { useDeliveryOrders } from "../apis/useDelivery";

const DeliveryOrders = () => {
  const { data: orders = [], isLoading, error } = useDeliveryOrders();

  if (isLoading) return <Loading text="Loading assigned orders..." />;
  if (error) return <Error error={error} />;

  const activeOrders = orders.filter((order) =>
    ["Packed", "Out for Delivery"].includes(order.status),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">Assigned Orders</h2>
        <p className="text-on-surface-variant">
          View assigned orders and update only their delivery status.
        </p>
      </div>

      {activeOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant bg-white p-10 text-center text-on-surface-variant">
          No assigned pending orders found.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {activeOrders.map((order) => (
            <DeliveryOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryOrders;
