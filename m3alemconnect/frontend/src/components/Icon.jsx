// A small, consistent line-icon set (24px grid, 1.75 stroke) drawn for this project.
const ICONS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  shieldCheck: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  message: (
    <>
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l5 5v13H6V3Z" />
      <path d="M14 3v5h5M9.5 13h6M9.5 17h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c1-4 4-6 7.5-6s6.5 2 7.5 6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5h6v2M3 12h18" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13.5-1.5 7.5L12 18.5l4.5 2.5L15 13.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: <path d="M9 4H5v16h4M14 8l4 4-4 4M18 12H9" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5-9 9" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 13h5l1.5 3h5l1.5-3h5" />
      <path d="M5 5h14l2 8v6H3v-6l2-8Z" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.4 3.3-5 6.5-5s5.7 1.6 6.5 5" />
      <path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 15.3c1.8.7 3 2.3 3.5 4.7" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5Z" />
  ),

  // Trades
  plumbing: (
    <>
      <path d="M5 7v6" />
      <path d="M5 10h9a4 4 0 0 1 4 4v1" />
      <path d="M10 10V7M8 7h4" />
      <path d="M18 18.5v1.5" />
    </>
  ),
  electricity: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  carpentry: (
    <>
      <path d="M4 4v16h16" />
      <path d="M4 8h2.5M4 12h3.5M4 16h2.5M8 20v-2.5M12 20v-3.5M16 20v-2.5" />
    </>
  ),
  painting: (
    <>
      <rect x="4" y="3" width="13" height="6" rx="1.5" />
      <path d="M17 6h2.5v5H11v3" />
      <rect x="9.5" y="14" width="3" height="7" rx="1" />
    </>
  ),
  masonry: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19" />
    </>
  ),
  appliance: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M8 6.5h2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3V6Z" />
      <path d="M14 9h4l3 3.5V16h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  cleaning: (
    <>
      <path d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4Z" />
      <path d="m18.5 15.5.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z" />
    </>
  ),
};

const CATEGORY_ICONS = {
  plomberie: 'plumbing',
  electricite: 'electricity',
  menuiserie: 'carpentry',
  peinture: 'painting',
  maconnerie: 'masonry',
  reparation: 'appliance',
  demenagement: 'truck',
  nettoyage: 'cleaning',
};

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.75, title, flipInRtl = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${flipInRtl ? 'rtl:-scale-x-100' : ''} ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name]}
    </svg>
  );
}

export function CategoryIcon({ slug, className }) {
  return <Icon name={CATEGORY_ICONS[slug] || 'briefcase'} className={className} />;
}
