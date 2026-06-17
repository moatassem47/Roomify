import { useState } from 'react';
import Button from '../../../components/common/Button';
import QuantityButton from '../../../components/common/QuantityButton';
import { ShoppingCart, Heart } from 'lucide-react';
import useAuth from "../../../store/authStore"
import useCart from '../../../store/cartStore';
import { useParams } from 'react-router-dom';
import { useAddToCart } from '../../cart/apis/useCart';
const ProductActions = () => {
  const {id}=useParams()
  const {mutate}=useAddToCart()
  const [quantity, setQuantity] = useState(1);
  const {openPopUp,isAuthenticated}=useAuth()
  const {increaseQuantity}=useCart()
  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));

  const onClick=()=>{
    if(isAuthenticated){
      mutate({productId:id,quantity})
      increaseQuantity(quantity)
    }else{
      openPopUp("login")
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mt-1">
        <QuantityButton
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
        <Button className="flex-1 flex items-center justify-center gap-2" 
        onClick={onClick}
        >
          <ShoppingCart/> Add to Cart
        </Button>
      </div>

      <Button className="w-full bg-transparent! text-brand-cedar! border border-brand-cedar hover:bg-brand-cedar/5! flex justify-center items-center gap-3"
      >
        <Heart className="text-brand-cedar fill-brand-cedar"/> Save to Wishlist
      </Button>
    </>
  );
};

export default ProductActions;
