
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

import { useGetCart } from "../apis/useCart";
const Summary = () => {
  const { data,isLoading} = useGetCart()
  const navigate=useNavigate()
  if(isLoading) return null
  const totalPrice=data.totalPrice
  
  return (
    <div className={totalPrice===0?`hidden`:`md:col-span-4 col-span-12 h-100 p-5  bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-7 md:mt-15 mt-1`}>
      <h2 className="md:text-2xl text-xl font font-semibold">Order Summary</h2>
      <div className="mt-4 flex flex-col justify-between content-between gap-5 text-[#777070] text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{totalPrice.toFixed(2)} EG</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span>Tax estimate</span>
          <span>0</span>
        </div>

        <div className="flex justify-between font-bold mt-4 pt-4 border-t border-[#efe8e8] text-xl font-serif">
          <span className="text-black">Total</span>
          <span className="text-brand-cedar lg:text-2xl md:text-xl text-lg">
            {totalPrice.toFixed(2)} EG
          </span>
        </div>
      </div>
        <Button onClick={()=>navigate("/checkout")}>Proceed to Checkout</Button>
    </div>
  );
};

export default Summary;
