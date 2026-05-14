import StarRating from './StarRating';

const ProductHeader = ({ category, name, rating, reviews, price, stockQuantity, description }) => {
  return (
    <>
      <span className="inline-block text-xs font-sans font-semibold uppercase tracking-widest text-brand-cedar bg-brand-cedar/10 px-3 py-1 rounded-full w-fit">
        {category}
      </span>
      <h1 className="font-serif text-3xl text-brand-charcoal leading-tight">
        {name}
      </h1>
      <StarRating rating={rating || 4.5} reviews={reviews || 0} />
      <div className='flex justify-between items-center'>
        <p className="font-sans text-2xl font-bold text-brand-cedar">
          {Number(price).toLocaleString('en-EG', { style: 'currency', currency: 'EGP' })}
        </p>
        {stockQuantity !== 0 ? (
          <div>
            <span className='text-sm text-brand-sage'>• {stockQuantity} in stock</span>
            <p className='text-xs text-gray-500'>Ready to ship</p>
          </div>
        ) : (
          <div className='bg-red-500 text-white font-bold px-3 py-2 rounded-base text-xs'>
            Out of Stock
          </div>
        )}
      </div>
      <p className="font-sans text-sm text-brand-text leading-relaxed">
        {description}
      </p>
    </>
  );
};

export default ProductHeader;
