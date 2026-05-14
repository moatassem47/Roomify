import { useSearchParams } from "react-router-dom";
import {  RotateCcw } from "lucide-react";
import { useGetProducts } from "../apis/useProducts";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import Pagination from "../../../components/ui/Pagination";
import EmptyState from "../../../components/common/EmptyState"
import noProducts from "../../../assets/images/emptyCart.svg"

const Products = () => {
  const [searchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  const { data, isLoading, isFetching, error } = useGetProducts(filters);

 
  if (isLoading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
        <ProductCardSkeleton key={num} />
      ))}
    </div>
  );

  
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-error-container flex items-center justify-center">
        <RotateCcw className="w-7 h-7 text-brand-error" />
      </div>
      <h2 className="font-serif text-xl text-brand-charcoal">Something went wrong</h2>
      <p className="text-sm text-brand-surface-dim max-w-xs">{error.message || "Failed to load products. Please try again."}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2.5 bg-brand-cedar text-white text-sm font-semibold rounded-base hover:bg-brand-cedar-hover transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  
  if (!data || data.docs.length === 0) return (
    
      <EmptyState image={noProducts} alt="NoProducts" title="No products found" 
              text="Try adjusting your filters or search term to find what you're looking for."
             />
    
  );

  const totalResults = data.totalDocs;
  const products = data.docs;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-brand-surface-dim font-sans">
        Showing <span className="text-brand-charcoal font-semibold">{totalResults}</span> results
      </p>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
};

export default Products;
