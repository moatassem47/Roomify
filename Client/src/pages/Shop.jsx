import Products from "../features/products/components/Products";
import Filters from "../features/products/components/Filters";

const Shop = () => {
  return (
    <>
      
      <title>Shop | Roomify</title>
      <meta name="description" content="Browse our curated collection of premium furniture. Filter by price, category, and more." />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10">
        
        
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-brand-charcoal mb-2">Our Collection</h1>
          <p className="font-sans text-brand-honey text-sm">
            Handpicked pieces designed to elevate every room.
          </p>
        </div>

       
        <Filters />

        
        <Products />

      </div>
    </>
  );
};

export default Shop;