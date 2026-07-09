import { useState } from "react";
import { motion } from "framer-motion";
import { Grid2X2, List, RotateCcw } from "lucide-react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import Pagination from "../../../components/Pagination";
import noProducts from "../../../assets/images/emptyCart.svg";
import ProductCard from "./ProductCard";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useFilters from "../../../hooks/useFilters";

const Products = () => {
  const { currentFilters, setFilters, clearFilters } = useFilters([
    "search",
    "sort",
    "category",
    "minPrice",
    "maxPrice",
    "available",
    "rating",
    "page",
  ]);
  const [viewMode, setViewMode] = useState("grid");
  const filters = Object.fromEntries(
    Object.entries(currentFilters).filter(([, value]) => value),
  );
  const params = new URLSearchParams(filters);
  const { data, isLoading, isFetching, error } = useFetchQuery(`/products?${params.toString()}`,["products",filters]);
  const {data:wishlist}=useFetchQuery("/user/wishlist",["wishlist"])
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <ProductCardSkeleton key={num} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[20px]  px-6 py-20 text-center shadow-ambient">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-error-container">
          <RotateCcw className="h-7 w-7 text-brand-error" />
        </div>
        <h2 className="font-serif text-2xl text-brand-charcoal">Something went wrong</h2>
        <p className="max-w-xs text-sm leading-6 text-brand-text/70">
          {error.message || "Failed to load products. Please try again."}
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

  if (!data || data.docs?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px]  px-6 py-16 text-center shadow-ambient">
        <img src={noProducts} alt="" className="mb-6 h-52 w-52" />
        <h2 className="font-serif text-4xl font-semibold text-brand-charcoal">No products found</h2>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-brand-text/70">
          Try a different search, category, or price range to reveal more pieces.
        </p>
        <button
          type="button"
          onClick={() => clearFilters()}
          className="mt-7 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-cedar focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar focus-visible:ring-offset-4"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  const totalResults = data.totalDocs;
  const products = data.docs;

  const updateSort = (sort) => {
    setFilters({ sort, page: "1" });
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 rounded-[20px]  p-4   md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-text/65">
          Showing <span className="text-brand-charcoal">{totalResults}</span> Products
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full bg-brand-surface-container p-1" role="group" aria-label="Product view">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30 ${
                viewMode === "grid" ? "bg-white text-brand-cedar shadow-sm" : "text-brand-text/55 hover:text-brand-charcoal"
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cedar/30 ${
                viewMode === "list" ? "bg-white text-brand-cedar shadow-sm" : "text-brand-text/55 hover:text-brand-charcoal"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <select
            value={currentFilters.sort || ""}
            onChange={(e) => updateSort(e.target.value)}
            className="h-11 rounded-full border border-brand-surface-container bg-white px-4 text-sm font-semibold text-brand-charcoal outline-none transition focus:border-brand-cedar focus:ring-2 focus:ring-brand-cedar/20"
            aria-label="Sort products"
          >
            <option value="">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <motion.div
        layout
        className={`${viewMode === "grid" ? "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4" : "grid grid-cols-1 gap-5"} transition-opacity px-8 duration-300 ${
          isFetching ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} variant={viewMode === "list" ? "shopList" : "vertical"} wishlist={wishlist} />
        ))}
      </motion.div>

      <Pagination totalPages={data.totalPages} />
    </div>
  );
};

export default Products;
