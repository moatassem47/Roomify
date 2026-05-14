import { Star} from 'lucide-react';

const StarRating = ({ rating = 0, reviews = 0 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < full
                ? 'fill-brand-honey text-brand-honey'
                : i === full && half
                ? 'fill-brand-honey/50 text-brand-honey'
                : 'fill-brand-surface-dim text-brand-surface-dim'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-brand-text font-sans">({reviews} Reviews)</span>
    </div>
  );
};

export default StarRating