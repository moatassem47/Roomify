import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { Heart, RotateCcw } from "lucide-react";
import EmptyState from "../components/EmptyState";
import ProductCard from "../features/products/components/ProductCard";
import { useGetWishlist } from "../features/wishlist/useWishlist";

const Wishlist = () => {
  const {
    data: wishlist,
    isLoading,
    error,
  } = useGetWishlist();
  if (isLoading) return <Loading />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] bg-white px-6 py-20 text-center shadow-ambient">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-error-container">
          <RotateCcw className="h-7 w-7 text-brand-error" />
        </div>
        <h2 className="font-serif text-2xl text-brand-charcoal">
          Something went wrong
        </h2>
        <p className="max-w-xs text-sm leading-6 text-brand-text/70">
          We couldn't load your wishlist items right now. Please check your
          connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-cedar focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar focus-visible:ring-offset-4"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (!wishlist || wishlist.length === 0) {
    return (
      <EmptyState
        button="Continue Shopping"
        text="Save your favorite products here to find them later and curate your perfect sanctuary."
        title="Your wishlist is empty"
        icon={<Heart />}
      />
    );
  }
  return (
    <div className="max-w-[1280px] mx-auto px-8 py-lg min-h-[calc(100vh-200px)]">
      <nav className="flex items-center gap-2 mb-sm text-label-md text-on-surface-variant/70">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        /<span className="text-on-surface font-semibold">Wishlist</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-lg">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            My Wishlist
          </h1>
          <p className="text-body-lg text-on-surface-variant ">
            You have{" "}
            <span className="font-bold text-primary" id="item-count">
              {wishlist.length}
            </span>
            {" "}items saved in your collection.
          </p>
        </div>
      </div>

      <section className="view-state" id="view-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {wishlist.map((item) => (
            <ProductCard product={item} wishlist={wishlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
