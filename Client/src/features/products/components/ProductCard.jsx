import { motion } from "framer-motion";
import { Heart, Star, Truck, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useToggleWishlist from "../../wishlist/useWishlist";
import { useAddToCart } from "../../cart/apis/useCart";
import useAuth from "../../../store/authStore";
import useRequireVerified from "../../../hooks/useRequireVerified";

const formatPrice = (price) => `${Number(price || 0).toLocaleString()} E£`;

const ProductCard = ({ product, variant = "vertical", className = "" ,wishlist}) => {
  const navigate = useNavigate();
  const { mutate } = useToggleWishlist();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isVerified = useRequireVerified();

  const image = product.imageUrls?.[0];
  const hoverImage = product.imageUrls?.[1] || image;

  const handleWishlist = (product) => {
    mutate(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return navigate("/login");
    }
    if (isVerified()) {
      addToCart({ product, quantity: 1 });
    }
  };
  
  const isInWishlist=wishlist?.some((item)=>item._id===product._id)??false

  if (variant === "vertical") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`group cursor-pointer overflow-hidden rounded-large bg-white shadow-ambient transition-all duration-300 hover:-translate-y-1.5 hover:shadow-ambient-hover ${className}`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="relative aspect-4/5 w-full overflow-hidden bg-white">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />

          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            onClick={(event) => {
              event.stopPropagation();
              handleWishlist(product);
            }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-charcoal shadow-sm backdrop-blur transition hover:scale-105 hover:text-brand-cedar focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar"
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? "fill-primary text-primary" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 p-4 text-left md:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cedar/75">
            {product.category || product.material || "Furniture"}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-brand-charcoal md:text-base">
            {product.name}
          </h3>

          {/* ── Star Rating ── */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={11}
                    className={star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-brand-surface-dim text-brand-surface-dim"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-brand-text">
                {Number(product.rating).toFixed(1)}
                {product.reviews > 0 && <span className="text-brand-surface-dim ml-1">({product.reviews})</span>}
              </span>
            </div>
          )}

          <div className="flex items-end justify-between gap-3 mt-1">
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-brand-charcoal">
                {formatPrice(product.price)}
              </p>
              {/* ── Free Delivery Badge ── */}
              <div className="flex items-center gap-1 text-[11px] text-brand-sage font-medium">
                <Truck size={10} />
                <span>Free Delivery</span>
              </div>
            </div>
          </div>

          
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity <= 0}
            className="mt-3.5 w-full flex items-center justify-center gap-2 bg-brand-cedar hover:bg-brand-cedar-hover text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:-translate-y-0.5 hover:shadow transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <ShoppingCart size={13} />
            <span>{isAdding ? "Adding..." : product.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </motion.article>
    );
  }

  if (variant === "shopList") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        className={`group grid cursor-pointer grid-cols-[120px_1fr] overflow-hidden rounded-large bg-white shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-ambient-hover md:grid-cols-[220px_1fr] ${className}`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="relative aspect-square overflow-hidden bg-white md:aspect-4/3">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center gap-2.5 p-4 md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cedar/75">
            {product.category || "Furniture"}
          </p>
          <h3 className="truncate text-base font-semibold text-brand-charcoal md:text-xl">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-lg font-bold text-brand-charcoal">
              {formatPrice(product.price)}
            </p>
            {/* ── Compact Add to Cart button for List Card ── */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || product.stockQuantity <= 0}
              className="flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-semibold py-2 px-4 rounded shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <ShoppingCart size={12} />
              <span>{isAdding ? "Adding..." : product.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        className={`group flex cursor-pointer items-center gap-4 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${className}`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-surface-container">
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-brand-cedar md:text-lg">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-brand-brown">
            {product.price} EGP{" "}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={`group flex cursor-pointer flex-col gap-4 ${className}`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-white">
          <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider">
            FEATURED
          </span>
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-sm text-brand-cedar md:text-xl">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.material}</p>
          </div>
          <p className="text-sm font-semibold text-brand-brown md:text-lg">
            {product.price} EGP{" "}
          </p>
        </div>
      </div>
    );
  }
};

export default ProductCard;
