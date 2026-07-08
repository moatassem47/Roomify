import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import { getDeliveryStatusLabel } from "../deliveryUtils";

const statusStyles = {
  Packed: {
    className: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  "Out for Delivery": {
    className: "bg-blue-100 text-blue-800",
    icon: Truck,
  },
  Delivered: {
    className: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  Cancelled: {
    className: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const DeliveryStatusBadge = ({ status }) => {
  const style = statusStyles[status] || {
    className: "bg-gray-100 text-gray-700",
    icon: Clock,
  };
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
    >
      <Icon size={14} />
      {getDeliveryStatusLabel(status)}
    </span>
  );
};

export default DeliveryStatusBadge;
