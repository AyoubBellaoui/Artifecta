export default function StarRating({ rating = 0, count, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const partial = !filled && i < rating;
    return { filled, partial };
  });
  const sizeClass = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm';
  return (
    <div className="flex items-center gap-1">
      <span className={`stars flex ${sizeClass}`}>
        {stars.map((s, i) => (
          <span key={i} className={s.filled ? 'text-saffron' : s.partial ? 'text-saffron/50' : 'text-gray-300'}>★</span>
        ))}
      </span>
      {count !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({count})</span>
      )}
      {rating > 0 && (
        <span className="text-gray-600 text-xs font-medium">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
}

export function InteractiveStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} className={`text-2xl transition-colors ${n <= value ? 'text-saffron' : 'text-gray-300 hover:text-saffron/50'}`}>★</button>
      ))}
    </div>
  );
}
