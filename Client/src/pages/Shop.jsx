
import Products from "../features/products/components/Products";
import Filters from "../features/products/components/Filters";

const Shop = () => {
  return (
    <>
      <title>Shop | Roomify</title>
      <meta
        name="description"
        content="Browse our curated collection of premium furniture. Filter by price, category, and more."
      />

      <div className="bg-brand-cream ">
        <div className="mx-auto  pb-8   md:pb-12 ">
          <div >
            <Filters />
            <Products />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
