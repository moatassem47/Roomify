const ProductCardSkeleton = ({ variant = "vertical", className = "" }) => {
  if (variant === "vertical") {
    return (
      <div className={`overflow-hidden rounded-[18px] bg-white shadow-ambient ${className}`}>
        <div className="aspect-[4/5] w-full animate-pulse bg-brand-surface-container" />
        <div className="space-y-3 p-4 md:p-5">
          <div className="h-3 w-24 animate-pulse rounded-full bg-brand-surface-container" />
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-brand-surface-container" />
          <div className="h-4 w-32 animate-pulse rounded-full bg-brand-surface-container" />
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 animate-pulse rounded-full bg-brand-surface-container" />
            <div className="flex gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-brand-surface-container" />
              <div className="h-4 w-4 animate-pulse rounded-full bg-brand-surface-container" />
              <div className="h-4 w-4 animate-pulse rounded-full bg-brand-surface-container" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-3 ${className}`}>
        <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-gray-200" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-4 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div className="aspect-video w-full animate-pulse rounded-2xl bg-gray-200" />
        <div className="mt-1 flex items-start justify-between">
          <div className="w-2/3 space-y-2">
            <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }
};

export default ProductCardSkeleton;
