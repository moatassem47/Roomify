import { useGetCart } from "../apis/useCart";
import ItemsCard from "./ItemsCard";
import emptyCart from "../../../assets/images/NoItemsCart.svg";
import EmptyState from "../../../components/common/EmptyState";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";
export const CartItems = () => {
  const { data: cart, error, isLoading } = useGetCart();

  if (isLoading) return (
  <div className="col-span-12">
    <Loading text="Loading Cart ..."/>
  </div>);

  if (error) return(
    <div className="col-span-12">
    <Error error={error}/>
    </div>
  )

  const items = cart?.cart.items;
  if (!items || items.length === 0)
    return (
  <div className="col-span-12">
    <EmptyState
      image={emptyCart}
      alt="emptyCart"
      text="It looks like you haven't found your next favorite piece yet."
      button="Start Shopping"
      title="Your Cart is Feeling Light"
    />
  </div>
    );
  return (
    <>
      <div className="flex flex-col gap-5 md:col-span-8 col-span-12">
        <h1 className="md:text-3xl text-2xl sm:text-start text-center font-bold tracking-wide">
          Your Sanctuary Selection
        </h1>
        {items.map((item) => (
          <ItemsCard key={item.productId?._id} item={item} />
        ))}
      </div>
    </>
  );
};

export default CartItems;
