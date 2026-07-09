// QuantitySelector.jsx
const QuantityButton = ({ quantity=1, onIncrease, onDecrease, className = "" }) => {
  return (
    <div className={`flex items-center border border-gray-300 rounded-full ${className}`}>
      
      
      <button 
        onClick={onDecrease}
        
        disabled={quantity <= 1} 
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand-cedar disabled:opacity-50 transition-colors"
      >
        -
      </button>

      
      <span className="w-8 text-center font-sans font-medium text-brand-cedar">
        {quantity}
      </span>

     
      <button 
        onClick={onIncrease}
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand-cedar transition-colors"
      >
        +
      </button>

    </div>
  );
};

export default QuantityButton;