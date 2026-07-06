import { Eye, MapPin, Phone, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryStatusBadge from "./DeliveryStatusBadge";
import {
  formatMoney,
  formatOrderId,
  getCustomerName,
  getCustomerPhone,
  getDeliveryAddress,
} from "../deliveryUtils";

const DeliveryOrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <article className="rounded-lg border border-surface-variant bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-cedar">
            {formatOrderId(order._id)}
          </p>
          <p className="text-sm text-on-surface-variant">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <DeliveryStatusBadge status={order.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-on-surface-variant">
        <div className="flex items-start gap-2">
          <ReceiptText size={16} className="mt-0.5 text-primary" />
          <span className="font-medium text-on-surface">
            {getCustomerName(order)}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Phone size={16} className="mt-0.5 text-primary" />
          <span>{getCustomerPhone(order)}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 text-primary" />
          <span>{getDeliveryAddress(order)}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-surface-variant pt-4">
        <div>
          <p className="text-xs font-semibold uppercase text-outline">
            Total price
          </p>
          <p className="font-semibold text-brand-charcoal">
            {formatMoney(order.totalAmount)}
          </p>
        </div>
        <button
          onClick={() => navigate(`/delivery/orders/${order._id}`)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:bg-brand-cedar-hover"
        >
          <Eye size={16} />
          View
        </button>
      </div>
    </article>
  );
};

export default DeliveryOrderCard;
