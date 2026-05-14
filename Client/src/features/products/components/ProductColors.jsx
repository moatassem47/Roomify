const ProductColors = ({ colors = [] }) => {
  if (colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-sans font-semibold uppercase tracking-widest text-brand-text">
        Colors
      </span>
      <div className="flex items-center gap-3 flex-wrap">
        {colors.map((color) => (
          <span
            key={color}
            title={color}
            className={`w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ring-2 ring-brand-cedar ring-offset-2 scale-110`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductColors;
