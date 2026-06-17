import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, variant = "vertical", className = "" }) => {

  const navigate=useNavigate()
  
  if (variant === "vertical") {
    return (
      <div className={`group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden shadow-ambient hover:shadow-ambient-hover transition-all duration-300 ${className}`}
      onClick={()=>navigate(`/product/${product._id}`)}
      >
        
       
        <div className="aspect-square w-full overflow-hidden bg-white relative">

          
          <img
            src={product.imageUrls?.[0]}
            alt={product.name}
            className="w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
          />

          
          <img
            src={product.imageUrls?.[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button className="w-full flex items-center justify-center gap-2 bg-brand-cedar hover:bg-brand-cedar-hover text-white text-xs font-semibold tracking-widest uppercase py-3 transition-colors duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Show More
            </button>
          </div>
        </div>

       
        <div className="p-4 flex flex-col gap-1 text-left">
          <h3 className="font-sans text-brand-charcoal text-sm font-semibold truncate">{product.name}</h3>
          <p className="font-sans text-xs text-brand-surface-dim truncate">{product.material || ""}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="font-sans text-brand-cedar font-bold text-sm">${product.price}</p>
            {product.specs?.color?.length > 0 && (
              <div className="flex gap-2">
                {product.specs.color.slice(0, 4).map(color => (
                  <div
                    key={color}
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-brand-surface-dim ring-offset-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
   

  if (variant === "horizontal") {
    return (
      <div className={`group cursor-pointer flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow ${className}`}
        onClick={()=>navigate(`/product/${product._id}`)}
      >
        <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-brand-surface-container">
          <img
            src={product.imageUrls?.[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
          />

          
          <img
            src={product.imageUrls?.[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          
        </div>
        <div className="flex flex-col">
          <h3 className="font-sans font-medium text-brand-cedar md:text-lg text-sm">{product.name}</h3>
          
          <p className="font-sans text-brand-brown font-semibold text-sm">{product.price} EGP </p>
        </div>
      </div>
    );
  }


  if (variant === "featured") {
    return (
      <div className={`group cursor-pointer flex flex-col gap-4 ${className}`}
        onClick={()=>navigate(`/product/${product._id}`)}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-white">
          <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs font-bold tracking-wider rounded-full z-10">FEATURED</span>
          <img
            src={product.imageUrls?.[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
          />

          
          <img
            src={product.imageUrls?.[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-brand-cedar md:text-xl text-sm">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.material}</p>
          </div>
          <p className="font-sans text-brand-brown font-semibold  md:text-lg text-sm">{product.price} EGP </p>
        </div>
      </div>
    );
  }
};

export default ProductCard;