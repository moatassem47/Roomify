
import { useGetCart } from "../../cart/apis/useCart";

const OrderSummary = () => {
   const { data,isLoading} = useGetCart()
  
  if(isLoading) return null
  const totalPrice=data.totalPrice
  const items=data.cart.items
  
  return (
    <div className="flex-1 bg-white h-fit rounded-2xl border border-brand-surface-container shadow-ambient p-6 flex flex-col gap-7">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="flex flex-col gap-5">
            {
                items.map((item)=>(
                    <div key={item.productId._id} className="flex gap-4">
                        <figure className="">
                            <img src={item.productId.imageUrls[1]} alt={item.productId.name} className="w-20 h-25 rounded-xl"/>
                        </figure>
                        <div className="flex flex-col justify-between flex-2">
                            <p className="text-xs font-serif">{item.productId.name}</p>
                            <div className="flex justify-between">
                                <span className="text-xs font-semibold">QTY : {item.quantity} </span>
                                <span className="text-xs text-brand-cedar">{item.productId.price.toFixed(2)} EG</span>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
        <div className="bg-brand-surface-dim h-[0.5px]"></div>
        <div className="mt-4 flex flex-col justify-between content-between gap-5 text-on-surface-variant text-sm">
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

        <div className="flex justify-between font-bold mt-4 pt-4 border-t border-surface-variant text-xl font-serif">
          <span className="text-on-surface">Total</span>
          <span className="text-brand-cedar lg:text-2xl md:text-xl text-lg">
            {totalPrice.toFixed(2)} EG
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary
