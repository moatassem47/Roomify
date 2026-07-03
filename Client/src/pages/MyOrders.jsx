
import OrderFilters from "../features/orders/OrderFilters";
import ViewOrders from "../features/orders/ViewOrders";


const MyOrders = () => {

  return (
    <div className="max-w-600 mx-auto px-6 py-6">
      <header className="mb-10">
        <h2 className="text-[48px] font-bold text-brand-charcoal mb-1">
          My Orders
        </h2>
        <p className="text-brand-text font-semibold">
          Track, manage, and review your orders.
        </p>
      </header>
      <OrderFilters/>
      <ViewOrders/>
    </div>
  );
};

export default MyOrders;
