const ProductCardSkeleton = ({ variant = "vertical", className = "" }) => {
  

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {/* Image Placeholder */}
        <div className="aspect-4/5 w-full rounded-2xl bg-gray-200 animate-pulse"></div>
        
        {/* Text Placeholders */}
        <div className="space-y-2 mt-1">
          {/* Title block */}
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          {/* Price block */}
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // 2. The Horizontal Layout Skeleton (Right Sidebar)
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 ${className}`}>
        {/* Image Placeholder */}
        <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-200 animate-pulse"></div>
        
        {/* Text Placeholders */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mt-1"></div>
        </div>
      </div>
    );
  }

  
  if (variant === "featured") {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        
        <div className="aspect-video w-full rounded-2xl bg-gray-200 animate-pulse"></div>
        
        
        <div className="flex justify-between items-start mt-1">
          <div className="space-y-2 w-2/3">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
};

export default ProductCardSkeleton;