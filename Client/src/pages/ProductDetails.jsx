import { useParams } from 'react-router-dom';
import { useGetSindgleProduct } from '../features/products/apis/useProducts';
import Breadcrumbs from '../components/common/BreadCrumbs';
import HorizontalLine from '../components/common/HorizontalLine';
import ImageGallery from '../features/products/components/ImageGallery';
import ProductHeader from '../features/products/components/ProductHeader';
import ProductColors from '../features/products/components/ProductColors';
import ProductQuickInfo from '../features/products/components/ProductQuickInfo';
import ProductActions from '../features/products/components/ProductActions';
import ProductTrustBadges from '../features/products/components/ProductTrustBadges';
import InfoTabs from '../features/products/components/InfoTabs';
import SuggestedProduct from '../features/products/components/SuggestedProduct';

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetSindgleProduct(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-surface-dim border-t-brand-cedar animate-spin" />
          <p className="text-sm font-sans text-brand-text">Loading product…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-brand-error font-sans">{error.message}</p>
      </div>
    );

  const specs = product?.specs || {};
  const colors = specs.color || [];
  const materials = specs.material || [];

  return (
    <>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col">
        <Breadcrumbs 
          items={[
            { label: 'Shop', path: '/shop' },
            { label: product.category || 'Products', path: `/shop?category=${product.category}` },
            { label: product.name }
          ]} 
        />
        
        <div className="grid md:grid-cols-2 grid-cols-1 gap-10 lg:gap-16">
        
          <div>
            <ImageGallery images={product.imageUrls} />
          </div>

        
          <div className="flex flex-col gap-5">
            <ProductHeader 
              category={product.category}
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              price={product.price}
              stockQuantity={product.stockQuantity}
              description={product.description}
            />
            
            <ProductColors colors={colors} />
            
            <ProductQuickInfo specs={specs} materials={materials} />
            
            <ProductActions />
            
            <ProductTrustBadges />

            <InfoTabs product={product} />
          </div>
        </div>
      <div className='mt-10 flex flex-col gap-7'>
      <HorizontalLine />
      <SuggestedProduct category={product.category} productID={product._id} />
      </div>
      </div>
    </>
  );
};

export default ProductDetails;