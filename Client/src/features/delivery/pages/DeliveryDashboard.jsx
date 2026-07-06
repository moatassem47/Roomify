import { Link } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";
import DeliveryOrderCard from "../components/DeliveryOrderCard";
import { useDeliveryOrders } from "../apis/useDelivery";
import { CheckCircle, ClipboardList, Truck } from "lucide-react";

const DeliveryDashboard = () => {
  const { data: orders = [], isLoading, error } = useDeliveryOrders();

  if (isLoading) return <Loading text="Loading delivery dashboard..." />;
  if (error) return <Error error={error} />;

  const activeOrders = orders.filter((order) =>
    ["Packed", "Out for Delivery"].includes(order.status),
  );
  const completedOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-surface-variant bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-primary">
            <ClipboardList size={22} />
            <span className="text-sm font-semibold">Assigned pending</span>
          </div>
          <p className="mt-3 text-3xl font-bold">{activeOrders.length}</p>
        </div>
        <div className="rounded-lg border border-surface-variant bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle size={22} />
            <span className="text-sm font-semibold">Completed</span>
          </div>
          <p className="mt-3 text-3xl font-bold">{completedOrders.length}</p>
        </div>
        <div className="rounded-lg border border-surface-variant bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-primary">
            <Truck size={22} />
            <span className="text-sm font-semibold">Total assigned</span>
          </div>
          <p className="mt-3 text-3xl font-bold">{orders.length}</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Assigned Pending Orders</h2>
            <p className="text-sm text-on-surface-variant">
              Orders assigned to you that still need delivery action.
            </p>
          </div>
          <Link
            to="/delivery/orders"
            className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            View all
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-outline-variant bg-white p-8 text-center text-on-surface-variant">
            No assigned pending orders right now.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeOrders.slice(0, 4).map((order) => (
              <DeliveryOrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Order History</h2>
            <p className="text-sm text-on-surface-variant">
              Completed deliveries from your account.
            </p>
          </div>
          <Link
            to="/delivery/history"
            className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            View history
          </Link>
        </div>

        {completedOrders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-outline-variant bg-white p-8 text-center text-on-surface-variant">
            Completed deliveries will appear here.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {completedOrders.slice(0, 2).map((order) => (
              <DeliveryOrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DeliveryDashboard;
