const OrderBadge = ({ status }) => {
  if (status == "Cancelled") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="px-6 py-1 rounded-full  bg-brand-error-container/30 text-brand-error flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-error"></span>
          Cancelled
        </span>
      </div>
    );
  } else if (status == "Placed"||status == "Packed") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="px-6 py-1 rounded-full  bg-primary-fixed text-on-primary-fixed flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-cedar"></span>
          Placed
        </span>
      </div>
    );
  } else if (status == "Delivered") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="px-6 py-1 rounded-full  bg-bg-secondary-container] text-on-secondary-container flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
          Delivered
        </span>
      </div>
    );
  } else if (status == "Out for Delivery") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="px-6 py-1 rounded-full text-label-md bg-bg-tertiary-container/20 text-brand-honey flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-honey"></span>
          Out for Delivery
        </span>
      </div>
    );
  }
};

export default OrderBadge;
