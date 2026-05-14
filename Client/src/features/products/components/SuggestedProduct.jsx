import { useSuggestProduct } from "../apis/useProducts"
import ProductCard from "./ProductCard"
import ProductCardSkeleton from "./ProductCardSkeleton"


const SuggestedProduct = ({category,productID}) => {
    const {data,isLoading,error}=useSuggestProduct(category,productID)

    if(isLoading) return 
    <div className="grid md:grid-cols-4 grid-col-2 gap-4">
        <ProductCardSkeleton />
     </div>
      
    if(error)  return null
    if(!data||data.docs.length===0) return null

    const products=data.docs
    
  return (
        <div className="flex flex-col gap-3 ">
         <h2 className="text-lg font-serif">More in This Category</h2>
         <div className="grid md:grid-cols-4 grid-col-2 gap-4">
        {products.map((product)=>(
            
            <ProductCard key={product._id} product={product} />
            
        ))}
         </div>
        </div>
    
  )
}

export default SuggestedProduct