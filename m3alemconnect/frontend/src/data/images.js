// Every decorative photo the site uses, in one place. The files live in public/images and are
// credited in CREDITS.md. Keep this file free of imports from mockData (mockData imports it).
import { normalizeKey } from '../i18n/helpers';

const BASE = '/images';

const CATEGORY_SLUGS = ['plomberie', 'electricite', 'menuiserie', 'peinture', 'maconnerie', 'reparation', 'demenagement', 'nettoyage'];

export function categoryImage(slug, variant = 'card') {
  const name = CATEGORY_SLUGS.includes(slug) ? slug : 'default';
  return `${BASE}/categories/${name}${variant === 'wide' ? '-wide' : ''}.webp`;
}

const CITY_FILES = ['casablanca', 'rabat', 'marrakech', 'fes', 'agadir', 'tanger', 'meknes', 'oujda'];

export function cityImage(name) {
  const key = normalizeKey(name);
  return `${BASE}/cities/${CITY_FILES.includes(key) ? key : 'default'}.webp`;
}

export const HERO_IMAGES = {
  main: `${BASE}/hero/main.webp`,
  detail: `${BASE}/hero/detail.webp`,
};

export const AUTH_IMAGE = `${BASE}/auth/panel.webp`;

// Same order as home.testimonials.items in the dictionaries.
export const TESTIMONIAL_AVATARS = [
  `${BASE}/testimonials/fatima-zahra.webp`,
  `${BASE}/testimonials/ahmed.webp`,
  `${BASE}/testimonials/nadia.webp`,
];

// Stock portraits for the fictional demo artisans, keyed by "First Last".
export const DEMO_PORTRAITS = Object.fromEntries(
  [
    'Khalid Benmoussa', 'Hassan El Fassi', 'Youssef Amrani', 'Rachid Ouali', 'Nabil Zouiten', 'Samir Chraibi',
    'Omar Tazi', 'Mehdi Alaoui', 'Adil Berrada', 'Karim Idrissi', 'Salma Bennani', 'Yassine Kettani',
  ].map((name) => [name, `${BASE}/artisans/${name.toLowerCase().replace(/\s+/g, '-')}.webp`]),
);

// Stand-in portraits for artisans who have not added a photo yet; the same artisan always gets the
// same one. Used on public listings only, never for the signed-in user's own avatar.
const FALLBACK_PORTRAITS = [1, 2, 3].map((n) => `${BASE}/artisans/portrait-${n}.webp`);

export function artisanPhoto(artisan) {
  if (artisan?.avatar_url) return artisan.avatar_url;
  const key = String(artisan?.id ?? `${artisan?.first_name}${artisan?.last_name}`);
  const hash = [...key].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
  return FALLBACK_PORTRAITS[hash % FALLBACK_PORTRAITS.length];
}

export function portfolioImages(slug) {
  const name = CATEGORY_SLUGS.includes(slug) ? slug : 'plomberie';
  return [1, 2, 3].map((n) => `${BASE}/portfolio/${name}-${n}.webp`);
}
