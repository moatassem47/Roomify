import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useToggleWishlist from "../../wishlist/useWishlist";

const formatPrice = (price) => `${Number(price || 0).toLocaleString()} E£`;

const ProductCard = ({ product, variant = "vertical", className = "" ,wishlist}) => {
  const navigate = useNavigate();
  const { mutate} = useToggleWishlist();
  const image = product.imageUrls?.[0];
  const hoverImage = product.imageUrls?.[1] || image;
  const colors = product.specs?.color || [];
  const handleWishlist = (productId) => {
    mutate(productId);
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
              handleWishlist(product._id);
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

        <div className="flex flex-col gap-3 p-4 text-left md:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cedar/75">
            {product.category || product.material || "Furniture"}
          </p>
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-brand-charcoal md:text-base">
              {product.name}
            </h3>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-base font-bold text-brand-charcoal">
                {formatPrice(product.price)}
              </p>
            </div>
            {colors.length > 0 && (
              <div className="flex shrink-0 gap-1.5">
                {colors.slice(0, 4).map((color) => (
                  <div
                    key={color}
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-brand-surface-dim ring-offset-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
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
        <div className="flex min-w-0 flex-col justify-center gap-2 p-4 md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cedar/75">
            {product.category || "Furniture"}
          </p>
          <h3 className="truncate text-base font-semibold text-brand-charcoal md:text-xl">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold text-brand-charcoal">
              {formatPrice(product.price)}
            </p>
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
