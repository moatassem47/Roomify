
import ProductCard from "./ProductCard"
import { useNewArrival } from "../apis/useProducts"
import ProductCardSkeleton from "./ProductCardSkeleton"

const NewArrival = () => {
    const {data,isFetching,error}=useNewArrival()


    
     if(isFetching) return (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        
        <div className="lg:col-span-8">
          <ProductCardSkeleton  variant="featured" />
        </div>

       
          <div className="lg:col-span-4 flex flex-col gap-4">
            {[1,2,3,4].map(num => (
              <ProductCardSkeleton key={num}  variant="horizontal" />
            ))}
          </div>

        </div>
     )

  if(error) return <h1 className="text-center text-brand-error text-xl">{error.message}</h1>

  if (!data || data.length === 0) return null;
  const listData=data.slice(1)
  const featuredProduct=data[0]
  console.log(listData)
  return (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        
        <div className="lg:col-span-8">
          <ProductCard product={featuredProduct} variant="featured" />
        </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            {listData?.map(product => (
              <ProductCard key={product._id} product={product} variant="horizontal" />
            ))}
          </div>

        </div>
  )
}

export default NewArrival