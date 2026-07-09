import { ChevronLeft, MapPin, Phone, ReceiptText, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Error from "../../../components/Error";
import Loading from "../../../components/Loading";
import DeliveryStatusBadge from "../components/DeliveryStatusBadge";
import {
  formatMoney,
  formatOrderId,
  getCustomerName,
  getCustomerPhone,
  getDeliveryAddress,
  getDeliveryStatusLabel,
} from "../deliveryUtils";
import {
  useDeliveryOrder,
  useMarkDeliveryDelivered,
  useStartDelivery,
} from "../apis/useDelivery";

const DeliveryOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useDeliveryOrder(id);
  const { mutate: startDelivery, isPending: isStarting } = useStartDelivery();
  const { mutate: markDelivered, isPending: isDelivering } =useMarkDeliveryDelivered();
   

  if (isLoading) return <Loading text="Loading order details..." />;
  if (error) return <Error error={error} />;
  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-on-surface-variant">
        Order not found.
      </div>
    );
  }
  
  const isUpdating = isStarting || isDelivering;

  const handleStartDelivery = () => {
    startDelivery(order._id, {
      onSuccess: () => toast.success("Delivery status updated to On The Way"),
      onError: (err) =>
        toast.error(err?.message || "Failed to update delivery status"),
    });
  };
  
  const handleDelivered = () => {
    markDelivered(order._id, {
      onSuccess: () => toast.success("Delivery marked as delivered"),
      onError: (err) =>
        toast.error(err?.message || "Failed to update delivery status"),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-surface-variant bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-outline">
                  Order
                </p>
                <h2 className="text-3xl font-semibold">
                  {formatOrderId(order._id)}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Assigned on {new Date(order.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <DeliveryStatusBadge status={order.status} />
            </div>
          </section>

          <section className="rounded-lg border border-surface-variant bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">
              Customer Delivery Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <UserRound className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase text-outline">
                    Customer name
                  </p>
                  <p className="font-medium">{getCustomerName(order)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase text-outline">
                    Customer phone
                  </p>
                  <p className="font-medium">{getCustomerPhone(order)}</p>
                </div>
              </div>
              <div className="flex gap-3 md:col-span-2">
                <MapPin className="mt-1 text-primary" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase text-outline">
                    Delivery address/location
                  </p>
                  <p className="font-medium">{getDeliveryAddress(order)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-surface-variant bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Ordered Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-130 text-left text-sm">
                <thead className="border-b border-surface-variant text-xs uppercase text-outline">
                  <tr>
                    <th className="py-3">Item</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Unit price</th>
                    <th className="py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {order.items.map((item) => (
                    <tr key={item.productId?._id || item.productId || item.unitPrice}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {item.productId?.imageUrls?.[0] && (
                            <img
                              src={item.productId.imageUrls[0]}
                              alt={item.productId?.name || "Order item"}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                          )}
                          <span className="font-medium">
                            {item.productId?.name || "Product"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4">{formatMoney(item.unitPrice)}</td>
                      <td className="py-4 text-right font-semibold">
                        {formatMoney(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-surface-variant bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <ReceiptText size={20} />
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Payment method</span>
                <span className="font-semibold">
                  {order.paymentMethod || "Not available"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Current status</span>
                <span className="font-semibold">
                  {getDeliveryStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-surface-variant pt-3 text-base">
                <span className="font-semibold">Total price</span>
                <span className="font-bold text-primary">
                  {formatMoney(order.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-surface-variant bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold">Delivery Status</h3>
            {order.status === "Packed" && (
              <button
                onClick={handleStartDelivery}
                disabled={isUpdating}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:bg-brand-cedar-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? "Updating..." : "Mark On The Way"}
              </button>
            )}
            {order.status === "Out for Delivery" && (
              <button
                onClick={handleDelivered}
                disabled={isUpdating}
                className="w-full rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-on-secondary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? "Updating..." : "Mark Delivered"}
              </button>
            )}
            {order.status === "Delivered" && (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                Delivery completed.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default DeliveryOrderDetails;
