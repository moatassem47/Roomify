export const getCustomerName = (order) => {
  const customer = order?.userId;

  if (!customer) return "Unknown customer";
  if (customer.name) return customer.name;

  return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
};

export const getCustomerPhone = (order) => {
  return order?.userId?.phone || order?.shippingAddress?.phone || "Not available";
};

export const getDeliveryAddress = (order) => {
  const address = order?.shippingAddress;

  if (!address) return "No address available";

  return [address.street, address.city, address.postalCode]
    .filter(Boolean)
    .join(", ");
};

export const getDeliveryStatusLabel = (status) => {
  if (status === "Packed") return "Pending";
  if (status === "Out for Delivery") return "On The Way";
  return status || "Unknown";
};

export const formatOrderId = (id) => {
  return id ? `#RF-${id.slice(-6).toUpperCase()}` : "N/A";
};

export const formatMoney = (value) => {
  return `${Number(value || 0).toLocaleString("en-US")} EGP`;
};
