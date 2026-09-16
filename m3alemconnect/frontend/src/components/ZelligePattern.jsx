// Eight-point star lattice inspired by Moroccan zellige, drawn as a repeating line pattern.
// Colour comes from the `text-*` class passed in, so it can sit on navy or on saffron.
export default function ZelligePattern({ className = '' }) {
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id="zellige-pattern" width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M16 16h24v24H16zM28 11l17 17-17 17-17-17zM28 0v11M56 28H45M28 56V45M0 28h11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige-pattern)" />
    </svg>
  );
}
