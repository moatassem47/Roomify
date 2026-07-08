import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";
import useFetchQuery from "../../hooks/useFetchQuery";
import useFilters from "../../hooks/useFilters";
import emptyCart from "../../assets/images/NoItemsCart.svg";
import OrderCard from "./OrderCard";
import Error from "../../components/common/Error";
import useAuth from "../../store/authStore";

const ViewOrders = () => {
  const { currentFilters } = useFilters(["status", "startDate", "endDate"]);
  const user=useAuth((s)=>s.user)
  const endpoint = `/order/?status=${currentFilters.status || ""}&endDate=${currentFilters.endDate || ""}&startDate=${currentFilters.startDate || ""}`;

  const { data:orders, isLoading, error } = useFetchQuery(endpoint, [
    "order",
    "view orders",
    currentFilters,
  ]);
  if (isLoading) return <Loading />;
  if (error) return  <Error error={error} />
  if (orders?.length === 0||!user?.isVerified) {
    return (
      <EmptyState
        alt="no orders found"
        button="Start Shopping"
        image={emptyCart}
        text="You haven't placed any orders yet. Discover pieces you love and your orders will appear here."
        title="No Orders Yet"
      />
    );
  }
  console.log(orders);

  return (
    <div className="grid grid-col-1 gap-4">
        {orders.map((order)=>(
            <OrderCard order={order} />
        ))}
    </div>
  );
};

export default ViewOrders;
