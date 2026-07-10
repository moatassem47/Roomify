
import { HeartOff,  ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const CheckoutFailed = () => {
  const {state}=useLocation()
  
  


  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 bg-brand-cream font-sans">
      
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f4efe9] mb-6">
        <HeartOff className="w-8 h-8 text-brand-cedar" strokeWidth={1.5} />
      </div>

      
      <h1 className="text-3xl sm:text-4xl font-serif text-brand-charcoal mb-4 text-center">
        Something went wrong.
      </h1>

      
      <p className="text-brand-error max-w-fit text-center mb-8 leading-relaxed">
        {state.error} 
      </p>

      

      
      <Link
        to="/checkout"
        className="flex items-center justify-center gap-2 bg-brand-cedar hover:bg-brand-cedar-hover text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-sm w-full max-w-2xl mb-6"
      >
        <span>Retry Payment</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      
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