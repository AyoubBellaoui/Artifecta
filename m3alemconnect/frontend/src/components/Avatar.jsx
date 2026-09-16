const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-20 w-20 text-xl',
};

export default function Avatar({ firstName = '', lastName = '', src, size = 'md', className = '' }) {
  if (src) {
    return <img src={src} alt="" className={`${SIZES[size]} shrink-0 rounded-md object-cover ${className}`} />;
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
