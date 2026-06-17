import QuantityButton from "../../../components/common/QuantityButton"
import { Trash2 } from 'lucide-react';
import { useDeleteItem ,useUpdateQuantity} from "../apis/useCart";

const ItemsCard = ({item ,className = ""}) => {
    const product=item.productId
    const { mutate: deleteItem } = useDeleteItem();
    const {mutate:updateQuantity}=useUpdateQuantity()
    

    const handleIncrease=()=>{
        updateQuantity({ productId: product._id, action: "increment" })
    }

     const handleDecrease=()=>{
        updateQuantity({ productId: product._id, action: "decrement" })
    }
  return (
    <div className={`  flex  gap-4 p-7 bg-white rounded-2xl shadow-sm  ${className}`}
      >
        <div className="sm:w-40 sm:h-40 h-20 w-20  flex  self-center justify-center items-center overflow-hidden rounded-2xl ">
          <img
            src={product.imageUrls?.[1]}
            alt={product.name}
            className="w-full h-full object-cover  inset-0 transition-opacity duration-500 group-hover:opacity-0"
          />

        
        </div>
        <div className="flex-1 flex flex-col md:gap-10 gap-7 justify-between">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-semibold text-black md:text-xl text-sm">{product.name}</h3>
          
          <p className="font-serif text-brand-cedar font-semibold  md:text-xl text-sm">{product.price} EGP </p>
        </div>
        <div className="flex justify-between items-center  ">
            <QuantityButton quantity={item.quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} className="w-20 sm:w-auto"/>
            <span 
              className="flex gap-2 items-center text-[#c6b9b9] hover:-translate-y-1 duration-300 cursor-pointer md:text-base text-sm"
              onClick={() => deleteItem(product._id)}
            >
                <Trash2 color="#c6b9b9" /> Remove
            </span>
        </div>
        </div>
      </div>
  )
}

export default ItemsCard