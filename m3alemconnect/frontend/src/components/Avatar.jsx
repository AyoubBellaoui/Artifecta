import { useEffect, useState } from 'react';

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-28 w-28 text-3xl',
};

const PIXELS = { sm: 36, md: 48, lg: 80, xl: 64, '2xl': 112 };

export default function Avatar({ firstName = '', lastName = '', src, size = 'md', className = '' }) {
  // A missing or broken photo falls back to the initials.
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        width={PIXELS[size]}
        height={PIXELS[size]}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`${SIZES[size]} shrink-0 rounded-md bg-navy-50 object-cover ${className}`}
      />
    );
  }

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size]} inline-flex shrink-0 items-center justify-center rounded-md bg-navy-50 font-semibold text-navy-700 ring-1 ring-inset ring-navy-100 ${className}`}
    >
      {initials}
    </span>
  );
}
