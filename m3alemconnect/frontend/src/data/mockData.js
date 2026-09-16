import { normalizeKey } from '../i18n/helpers';

// Used when Supabase is unreachable or still empty, so the concept can be presented anywhere.

export const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Meknès', 'Oujda', 'Tétouan', 'Salé', 'Kénitra', 'El Jadida'];

export const FALLBACK_CATEGORIES = [
  { id: 1, slug: 'plomberie', name_fr: 'Plomberie', name_ar: 'السباكة', artisan_count: 48 },
  { id: 2, slug: 'electricite', name_fr: 'Électricité', name_ar: 'الكهرباء', artisan_count: 63 },
  { id: 3, slug: 'menuiserie', name_fr: 'Menuiserie', name_ar: 'النجارة', artisan_count: 35 },
  { id: 4, slug: 'peinture', name_fr: 'Peinture', name_ar: 'الصباغة', artisan_count: 41 },
  { id: 5, slug: 'maconnerie', name_fr: 'Maçonnerie', name_ar: 'البناء', artisan_count: 29 },
  { id: 6, slug: 'reparation', name_fr: 'Réparation d’appareils', name_ar: 'إصلاح الأجهزة', artisan_count: 52 },
  { id: 7, slug: 'demenagement', name_fr: 'Déménagement', name_ar: 'نقل الأثاث', artisan_count: 24 },
  { id: 8, slug: 'nettoyage', name_fr: 'Nettoyage', name_ar: 'التنظيف', artisan_count: 37 },
];

export const CITY_STATS = [
  { name: 'Casablanca', artisans: 312 },
  { name: 'Rabat', artisans: 187 },
  { name: 'Marrakech', artisans: 243 },
  { name: 'Fès', artisans: 156 },
  { name: 'Agadir', artisans: 134 },
  { name: 'Tanger', artisans: 98 },
  { name: 'Meknès', artisans: 87 },
  { name: 'Oujda', artisans: 76 },
];

export const FALLBACK_PLANS = [
  { id: 1, code: 'free', name: 'Gratuit', price: 0, duration_days: 30 },
  { id: 2, code: 'pro', name: 'Pro', price: 199, duration_days: 30 },
  { id: 3, code: 'premium', name: 'Premium', price: 399, duration_days: 30 },
];

const REVIEW_POOL = [
  {
    rating: 5,
    comment: {
      fr: 'Intervention rapide et travail très propre. Le prix correspondait exactement au devis.',
      ar: 'تدخل سريع وعمل نظيف جداً. السعر كان مطابقاً تماماً لعرض السعر.',
    },
  },
  {
    rating: 5,
    comment: {
      fr: 'Ponctualité, écoute et bons conseils. Je recommande sans hésiter.',
      ar: 'دقة في المواعيد، إصغاء جيد ونصائح مفيدة. أوصي بهذه الخدمة دون تردد.',
    },
  },
  {
    rating: 5,
    comment: {
      fr: 'Très bon rapport qualité-prix. Le chantier a été laissé propre à la fin de chaque journée.',
      ar: 'جودة ممتازة مقابل السعر. تُرك مكان العمل نظيفاً في نهاية كل يوم.',
    },
  },
  {
    rating: 5,
    comment: {
      fr: 'Travail soigné et délais respectés. Nous referons appel à ses services.',
      ar: 'عمل متقن واحترام للآجال. سنطلب هذه الخدمات مجدداً.',
    },
  },
  {
    rating: 5,
    comment: {
      fr: 'Communication claire du début à la fin, et un résultat conforme à nos attentes.',
      ar: 'تواصل واضح من البداية إلى النهاية، ونتيجة مطابقة لتوقعاتنا.',
    },
  },
  {
    rating: 5,
    comment: {
      fr: 'Devis reçu le jour même, intervention le lendemain. Service sérieux.',
      ar: 'توصلت بعرض السعر في نفس اليوم وكان التدخل في اليوم الموالي. خدمة جدية.',
    },
  },
  {
    rating: 4,
    comment: {
      fr: 'Quelques jours de retard sur le planning, mais la qualité du travail est au rendez-vous.',
      ar: 'تأخير ببضعة أيام عن الموعد المحدد، لكن جودة العمل كانت في المستوى.',
    },
  },
  {
    rating: 5,
    comment: {
      fr: 'Professionnel et transparent sur les prix. Rien à redire.',
      ar: 'احترافية وشفافية في الأسعار. لا شيء يُعاب.',
    },
  },
];

const REVIEWERS = [
  ['Fatima Zahra', 'M.'],
  ['Ahmed', 'B.'],
  ['Nadia', 'E.'],
  ['Karim', 'T.'],
  ['Imane', 'R.'],
  ['Mohamed', 'A.'],
  ['Sara', 'L.'],
  ['Hicham', 'O.'],
];

const REVIEW_DATES = ['2026-08-21', '2026-07-09', '2026-05-30', '2026-04-14', '2026-03-02'];

function demoReviews(index) {
  return [0, 3, 5].map((offset, i) => {
    const poolIndex = (index + offset) % REVIEW_POOL.length;
    const [first_name, last_name] = REVIEWERS[(index + i * 3) % REVIEWERS.length];
    return {
      id: `demo-review-${index}-${i}`,
      first_name,
      last_name,
      rating: REVIEW_POOL[poolIndex].rating,
      comment: REVIEW_POOL[poolIndex].comment,
      created_at: REVIEW_DATES[(index + i) % REVIEW_DATES.length],
    };
  });
}

const ARTISANS = [
  {
    first_name: 'Khalid', last_name: 'Benmoussa', city: 'Casablanca', category_slug: 'plomberie',
    rating_avg: 4.9, rating_count: 47, years_experience: 12, total_jobs: 156, hourly_rate: 150,
    is_premium: true, is_available: true, is_verified: true, views_count: 1284, created_at: '2024-02-12',
    service_areas: ['Casablanca', 'Mohammedia', 'Bouskoura'],
    bio: {
      fr: 'Plombier depuis 12 ans à Casablanca. J’interviens pour les fuites, le remplacement de chauffe-eau et la rénovation complète de salles de bain, avec un devis détaillé avant chaque intervention.',
      ar: 'سبّاك منذ 12 سنة في الدار البيضاء. أتدخل لإصلاح التسربات وتغيير سخانات الماء والتجديد الكامل للحمامات، مع تقديم عرض سعر مفصل قبل كل تدخل.',
    },
    skills: {
      fr: ['Recherche de fuites', 'Chauffe-eau', 'Salles de bain', 'Débouchage'],
      ar: ['كشف التسربات', 'سخانات الماء', 'الحمامات', 'تسليك المجاري'],
    },
  },
  {
    first_name: 'Hassan', last_name: 'El Fassi', city: 'Rabat', category_slug: 'electricite',
    rating_avg: 4.8, rating_count: 62, years_experience: 8, total_jobs: 203, hourly_rate: 120,
    is_premium: true, is_available: true, is_verified: true, views_count: 1530, created_at: '2023-11-05',
    service_areas: ['Rabat', 'Salé', 'Témara'],
    bio: {
      fr: 'Électricien certifié, spécialisé dans la mise aux normes, l’installation de tableaux électriques et l’éclairage pour logements et commerces.',
      ar: 'كهربائي معتمد، متخصص في مطابقة التجهيزات للمعايير وتركيب اللوحات الكهربائية والإنارة للمنازل والمحلات التجارية.',
    },
    skills: {
      fr: ['Mise aux normes', 'Tableaux électriques', 'Éclairage LED', 'Dépannage'],
      ar: ['المطابقة للمعايير', 'اللوحات الكهربائية', 'إنارة LED', 'الإصلاح الطارئ'],
    },
  },
  {
    first_name: 'Youssef', last_name: 'Amrani', city: 'Marrakech', category_slug: 'menuiserie',
    rating_avg: 4.7, rating_count: 38, years_experience: 15, total_jobs: 89, hourly_rate: 200,
    is_premium: false, is_available: true, is_verified: true, views_count: 842, created_at: '2024-05-20',
    service_areas: ['Marrakech'],
    bio: {
      fr: 'Menuiserie et ébénisterie : placards, portes, cuisines et meubles sur mesure en bois massif ou MDF. Atelier à Marrakech.',
      ar: 'نجارة وصناعة الأثاث: خزائن وأبواب ومطابخ وأثاث حسب الطلب من الخشب الطبيعي أو MDF. ورشة في مراكش.',
    },
    skills: {
      fr: ['Placards sur mesure', 'Cuisines', 'Portes intérieures', 'Restauration de meubles'],
      ar: ['خزائن حسب الطلب', 'المطابخ', 'الأبواب الداخلية', 'ترميم الأثاث'],
    },
  },
  {
    first_name: 'Rachid', last_name: 'Ouali', city: 'Casablanca', category_slug: 'peinture',
    rating_avg: 4.9, rating_count: 71, years_experience: 10, total_jobs: 178, hourly_rate: 100,
    is_premium: true, is_available: false, is_verified: true, views_count: 1905, created_at: '2023-09-14',
    service_areas: ['Casablanca', 'Mohammedia'],
    bio: {
      fr: 'Peinture intérieure et extérieure, enduits décoratifs et tadelakt. Travail propre, avec protection systématique des sols et du mobilier.',
      ar: 'صباغة داخلية وخارجية، طلاءات زخرفية وتادلاكت. عمل نظيف مع حماية الأرضيات والأثاث بشكل منهجي.',
    },
    skills: {
      fr: ['Peinture intérieure', 'Façades', 'Tadelakt', 'Enduits décoratifs'],
      ar: ['الصباغة الداخلية', 'الواجهات', 'تادلاكت', 'الطلاءات الزخرفية'],
    },
  },
  {
    first_name: 'Nabil', last_name: 'Zouiten', city: 'Fès', category_slug: 'maconnerie',
    rating_avg: 4.6, rating_count: 29, years_experience: 20, total_jobs: 67, hourly_rate: 180,
    is_premium: false, is_available: true, is_verified: false, views_count: 512, created_at: '2025-01-08',
    service_areas: ['Fès', 'Meknès'],
    bio: {
      fr: 'Vingt ans d’expérience en maçonnerie : gros œuvre, extensions, carrelage et rénovation de maisons traditionnelles.',
      ar: 'عشرون سنة من الخبرة في البناء: الأشغال الكبرى، التوسعات، التبليط وترميم المنازل التقليدية.',
    },
    skills: {
      fr: ['Gros œuvre', 'Carrelage', 'Extensions', 'Rénovation'],
      ar: ['الأشغال الكبرى', 'التبليط', 'التوسعات', 'الترميم'],
    },
  },
  {
    first_name: 'Samir', last_name: 'Chraibi', city: 'Agadir', category_slug: 'nettoyage',
    rating_avg: 4.8, rating_count: 54, years_experience: 6, total_jobs: 312, hourly_rate: 80,
    is_premium: true, is_available: true, is_verified: true, views_count: 1176, created_at: '2024-03-30',
    service_areas: ['Agadir', 'Inezgane'],
    bio: {
      fr: 'Équipe de nettoyage professionnel pour appartements, bureaux et fins de chantier. Produits fournis, intervention sous 48 h.',
      ar: 'فريق تنظيف احترافي للشقق والمكاتب وما بعد الأشغال. المواد متوفرة، والتدخل في غضون 48 ساعة.',
    },
    skills: {
      fr: ['Fin de chantier', 'Bureaux', 'Vitres', 'Nettoyage régulier'],
      ar: ['تنظيف ما بعد الأشغال', 'المكاتب', 'الزجاج', 'التنظيف الدوري'],
    },
  },
  {
    first_name: 'Omar', last_name: 'Tazi', city: 'Tanger', category_slug: 'reparation',
    rating_avg: 4.7, rating_count: 58, years_experience: 9, total_jobs: 241, hourly_rate: 110,
    is_premium: false, is_available: true, is_verified: true, views_count: 968, created_at: '2024-07-02',
    service_areas: ['Tanger', 'Tétouan'],
    bio: {
      fr: 'Réparation d’électroménager et de climatiseurs toutes marques : lave-linge, réfrigérateurs, fours. Diagnostic sur place.',
      ar: 'إصلاح الأجهزة الكهرومنزلية والمكيفات من جميع العلامات: آلات الغسيل، الثلاجات، الأفران. تشخيص في عين المكان.',
    },
    skills: {
      fr: ['Climatisation', 'Lave-linge', 'Réfrigérateurs', 'Diagnostic'],
      ar: ['التكييف', 'آلات الغسيل', 'الثلاجات', 'التشخيص'],
    },
  },
  {
    first_name: 'Mehdi', last_name: 'Alaoui', city: 'Casablanca', category_slug: 'demenagement',
    rating_avg: 4.6, rating_count: 33, years_experience: 7, total_jobs: 134, hourly_rate: 250,
    is_premium: false, is_available: true, is_verified: true, views_count: 734, created_at: '2024-10-11',
    service_areas: ['Casablanca', 'Rabat', 'El Jadida'],
    bio: {
      fr: 'Déménagement d’appartements et de bureaux, avec démontage et remontage des meubles. Camion de 20 m³ et équipe de trois personnes.',
      ar: 'نقل أثاث الشقق والمكاتب مع فك الأثاث وتركيبه. شاحنة بسعة 20 م³ وفريق من ثلاثة أشخاص.',
    },
    skills: {
      fr: ['Déménagement local', 'Montage de meubles', 'Emballage', 'Bureaux'],
      ar: ['النقل داخل المدينة', 'تركيب الأثاث', 'التغليف', 'المكاتب'],
    },
  },
  {
    first_name: 'Adil', last_name: 'Berrada', city: 'Rabat', category_slug: 'plomberie',
    rating_avg: 4.5, rating_count: 21, years_experience: 5, total_jobs: 72, hourly_rate: 130,
    is_premium: false, is_available: true, is_verified: true, views_count: 403, created_at: '2025-04-17',
    service_areas: ['Rabat', 'Témara'],
    bio: {
      fr: 'Plomberie et chauffage : installation sanitaire, chaudières et dépannage rapide à Rabat et dans ses environs.',
      ar: 'السباكة والتدفئة: التجهيزات الصحية، المراجل والإصلاح السريع في الرباط ونواحيها.',
    },
    skills: {
      fr: ['Installation sanitaire', 'Chaudières', 'Dépannage'],
      ar: ['التجهيزات الصحية', 'المراجل', 'الإصلاح السريع'],
    },
  },
  {
    first_name: 'Karim', last_name: 'Idrissi', city: 'Marrakech', category_slug: 'electricite',
    rating_avg: 4.8, rating_count: 40, years_experience: 11, total_jobs: 147, hourly_rate: 130,
    is_premium: true, is_available: true, is_verified: true, views_count: 1022, created_at: '2024-01-25',
    service_areas: ['Marrakech'],
    bio: {
      fr: 'Électricité pour villas et riads : installations neuves, domotique, éclairage extérieur et piscines.',
      ar: 'الكهرباء للفيلات والرياضات: التركيبات الجديدة، المنزل الذكي، الإنارة الخارجية والمسابح.',
    },
    skills: {
      fr: ['Installations neuves', 'Domotique', 'Éclairage extérieur'],
      ar: ['التركيبات الجديدة', 'المنزل الذكي', 'الإنارة الخارجية'],
    },
  },
  {
    first_name: 'Salma', last_name: 'Bennani', city: 'Rabat', category_slug: 'peinture',
    rating_avg: 4.9, rating_count: 36, years_experience: 7, total_jobs: 96, hourly_rate: 120,
    is_premium: false, is_available: true, is_verified: true, views_count: 688, created_at: '2024-09-03',
    service_areas: ['Rabat', 'Salé'],
    bio: {
      fr: 'Peinture décorative et conseil couleur pour appartements et locaux professionnels. Finitions soignées, délais respectés.',
      ar: 'صباغة زخرفية واستشارة في اختيار الألوان للشقق والمحلات المهنية. تشطيبات متقنة واحترام للآجال.',
    },
    skills: {
      fr: ['Peinture décorative', 'Conseil couleur', 'Papier peint'],
      ar: ['الصباغة الزخرفية', 'استشارة الألوان', 'ورق الجدران'],
    },
  },
  {
    first_name: 'Yassine', last_name: 'Kettani', city: 'Casablanca', category_slug: 'maconnerie',
    rating_avg: 4.7, rating_count: 44, years_experience: 14, total_jobs: 118, hourly_rate: 170,
    is_premium: true, is_available: true, is_verified: true, views_count: 1311, created_at: '2023-12-19',
    service_areas: ['Casablanca', 'Bouskoura'],
    bio: {
      fr: 'Entreprise de maçonnerie et de carrelage : rénovation d’appartements, cloisons, dalles et étanchéité.',
      ar: 'مقاولة في البناء والتبليط: تجديد الشقق، الحواجز، البلاطات والعزل المائي.',
    },
    skills: {
      fr: ['Carrelage', 'Cloisons', 'Étanchéité', 'Rénovation'],
      ar: ['التبليط', 'الحواجز', 'العزل المائي', 'التجديد'],
    },
  },
];

export const DEMO_ARTISANS = ARTISANS.map((artisan, index) => {
  const category = FALLBACK_CATEGORIES.find((c) => c.slug === artisan.category_slug);
  return {
    ...artisan,
    id: `demo-${index + 1}`,
    category_id: category.id,
    category_name_fr: category.name_fr,
    category_name_ar: category.name_ar,
    reviews: demoReviews(index),
    photos: [],
    isDemo: true,
  };
});

export function isDemoId(id) {
  return typeof id === 'string' && id.startsWith('demo-');
}

export function getDemoArtisan(id) {
  return DEMO_ARTISANS.find((artisan) => artisan.id === id) || null;
}

// Mirrors the database search: premium profiles always first.
export function filterDemoArtisans({ search = '', city = '', category = '', minRating = '', available = '', sort = 'rating' } = {}) {
  const query = search.trim().toLowerCase();
  const cityKey = normalizeKey(city);

  const results = DEMO_ARTISANS.filter((artisan) => {
    if (category && artisan.category_slug !== category) return false;
    if (cityKey && !normalizeKey(`${artisan.city} ${artisan.service_areas.join(' ')}`).includes(cityKey)) return false;
    if (minRating && artisan.rating_avg < Number(minRating)) return false;
    if (available === 'true' && !artisan.is_available) return false;
    if (query) {
      const haystack = `${artisan.first_name} ${artisan.last_name} ${artisan.bio.fr} ${artisan.bio.ar} ${artisan.category_name_fr}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const secondary = {
    rating: (a, b) => b.rating_avg - a.rating_avg,
    jobs: (a, b) => b.total_jobs - a.total_jobs,
    premium: (a, b) => b.rating_avg - a.rating_avg,
    newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  }[sort] || ((a, b) => b.rating_avg - a.rating_avg);

  return results.sort((a, b) => Number(b.is_premium) - Number(a.is_premium) || secondary(a, b));
}
