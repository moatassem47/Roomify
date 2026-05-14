import { Truck, ShieldCheck } from 'lucide-react';

const ProductTrustBadges = () => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-1">
      <div className="flex items-start gap-2.5 bg-brand-surface-container rounded-xl p-3">
        <Truck className="w-5 h-5 text-brand-cedar shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-sans font-semibold text-brand-charcoal">Free Delivery</p>
          <p className="text-xs font-sans text-brand-text">To your room of choice</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 bg-brand-surface-container rounded-xl p-3">
        <ShieldCheck className="w-5 h-5 text-brand-cedar shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-sans font-semibold text-brand-charcoal">5 Year Warranty</p>
          <p className="text-xs font-sans text-brand-text">Quality guaranteed</p>
        </div>
      </div>
    </div>
  );
};

export default ProductTrustBadges;
