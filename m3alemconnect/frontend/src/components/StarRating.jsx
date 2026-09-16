import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

const STAR_PATH = 'M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5Z';

const STAR_SIZES = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

function Star({ fill, className }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="absolute inset-0 h-full w-full text-sand-300">
        <path d={STAR_PATH} />
      </svg>
      {fill > 0 && (
        <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
          {/* Width is relative to the clipped wrapper, so scale it back up to the full star. */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="absolute inset-y-0 start-0 h-full text-saffron-500"
            style={{ width: `${100 / fill}%` }}
          >
            <path d={STAR_PATH} />
          </svg>
        </span>
      )}
    </span>
  );
}

export default function StarRating({ rating = 0, size = 'sm', showValue = false, count, className = '' }) {
  const { t, formatRating } = useI18n();
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-0.5" role="img" aria-label={t('common.ratingOutOf', { rating: formatRating(value) })}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} fill={Math.max(0, Math.min(1, value - i))} className={STAR_SIZES[size]} />
        ))}
      </span>
      {showValue && <span className="text-sm font-semibold text-navy-900">{formatRating(value)}</span>}
      {count !== undefined && (
        <span className="text-sm text-sand-600">({t('common.reviews', { count: Number(count) || 0 })})</span>
      )}
    </span>
  );
}

export function StarInput({ value, onChange, label }) {
  const { t } = useI18n();
  const [hovered, setHovered] = useState(0);

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={t('common.ratingOutOf', { rating: n })}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          className="rounded p-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={`h-7 w-7 transition-colors ${n <= (hovered || value) ? 'text-saffron-500' : 'text-sand-300'}`}
          >
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
}
