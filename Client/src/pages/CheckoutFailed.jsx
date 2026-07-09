import { useSearchParams, Link, useLocation } from "react-router-dom";
import { useGetOrderById } from "../features/checkout/apis/useOrder";
import { HeartOff, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const CheckoutFailed = () => {
  const {state}=useLocation()
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const { data: order, isLoading, error } = useGetOrderById(orderId);

  const displayOrderId = orderId ? `#RF-${orderId.slice(-6).toUpperCase()}` : "N/A";

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 bg-brand-cream font-sans">
      
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f4efe9] mb-6">
        <HeartOff className="w-8 h-8 text-brand-cedar" strokeWidth={1.5} />
      </div>

      
      <h1 className="text-3xl sm:text-4xl font-serif text-brand-charcoal mb-4 text-center">
        Something went wrong.
      </h1>

      
      <p className="text-brand-text max-w-fit text-center mb-8 leading-relaxed">
        We were unable to process your order. 
      </p>

      
      <div className="w-full max-w-fit bg-white rounded-2xl shadow-ambient border border-brand-surface-container overflow-hidden mb-8">
        <div className="px-5 py-3 bg-brand-surface-container/60 border-b border-brand-surface-container">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-text/70 font-sans">
            Failed Order Details
          </span>
        </div>

        
        <div className="p-5 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-brand-text">
              <Loader2 className="w-6 h-6 animate-spin mr-2" strokeWidth={1.5} />
              <span>Fetching order details...</span>
            </div>
          ) : error || !order ? (
            <div className="text-sm text-brand-text py-4 text-center">
              Could not retrieve order details.
            </div>
          ) : (
            order.items?.map((item) => (
              <div key={item.productId?._id} className="flex gap-4 items-center">
                <img
                  src={item.productId?.imageUrls?.[0] || "https://placehold.co/80x80?text=Product"}
                  alt={item.productId?.name}
                  className="w-16 h-16 rounded-xl object-cover border border-brand-surface-container"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-brand-charcoal text-base truncate">
                    {item.productId?.name}
                  </h4>
                  <p className="text-xs text-brand-text/80 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right font-serif text-brand-charcoal font-medium">
                  EGP {((item.unitPrice || item.productId?.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reason & Order ID Footer */}
        <div className="px-5 py-4 bg-brand-cream/40 border-t border-brand-surface-container flex justify-between items-center text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text/60 mb-1">
              Reason
            </span>
            <div className="flex items-center gap-1.5 text-brand-error font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{state.error}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-text/60 mb-1">
              Order ID
            </span>
            <span className="font-mono text-brand-charcoal font-medium">
              {displayOrderId}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Link
        to="/checkout"
        className="flex items-center justify-center gap-2 bg-brand-cedar hover:bg-brand-cedar-hover text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-sm w-full max-w-2xl mb-6"
      >
        <span>Retry Payment</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Secondary Links */}
      <div className="flex items-center gap-3 text-sm text-brand-text font-medium">
        <Link to="/cart" className="hover:text-brand-cedar transition-colors">
          Review Cart
        </Link>
        <span className="text-brand-surface-dim">•</span>
        <a href="mailto:support@roomify.com" className="hover:text-brand-cedar transition-colors">
          Contact Concierge
        </a>
      </div>
    </div>
  );
};

export default CheckoutFailed;