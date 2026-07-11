import { useState } from 'react';
import Button from '../../../components/Button';
import QuantityButton from '../../../components/QuantityButton';
import { ShoppingCart } from 'lucide-react';
import useAuth from "../../../store/authStore"
import { useNavigate } from 'react-router-dom';
import { useAddToCart } from '../../cart/apis/useCart';
import useRequireVerified from '../../../hooks/useRequireVerified';

const ProductActions = ({stock, product}) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const { mutate, isPending } = useAddToCart();

  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  
  const isVerified = useRequireVerified(); 


  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));

  const onClick = () => {
    if (!isAuthenticated) {
      return navigate("/login");
    }

   


    if (isVerified()) {
    
      mutate({ product, quantity });
    }
  };

  return (
    <div className="flex items-center gap-3 mt-1">
      <QuantityButton
        quantity={quantity}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        disabled={isPending} 
      />
      <Button 
        className="flex-1 flex items-center justify-center gap-2" 
        onClick={onClick}
        disabled={isPending||quantity>stock} 
      >
        <ShoppingCart/> {isPending ? "Adding..." :quantity>stock? "Out of the Stock":"Add to Cart"}
      </Button>
    </div>
  );
};

export default ProductActions;