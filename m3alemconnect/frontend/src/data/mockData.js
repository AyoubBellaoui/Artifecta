export const MOCK_CATEGORIES = [
  { id: 1, name_fr: 'Plomberie', name_ar: 'السباكة', slug: 'plomberie', icon: '🔧', artisan_count: 48, color: '#3B82F6', gradient: 'from-blue-500 to-blue-700' },
  { id: 2, name_fr: 'Électricité', name_ar: 'الكهرباء', slug: 'electricite', icon: '⚡', artisan_count: 63, color: '#F59E0B', gradient: 'from-amber-400 to-orange-500' },
  { id: 3, name_fr: 'Menuiserie', name_ar: 'النجارة', slug: 'menuiserie', icon: '🪚', artisan_count: 35, color: '#92400E', gradient: 'from-yellow-700 to-amber-800' },
  { id: 4, name_fr: 'Peinture', name_ar: 'الطلاء', slug: 'peinture', icon: '🎨', artisan_count: 41, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-700' },
  { id: 5, name_fr: 'Maçonnerie', name_ar: 'البناء', slug: 'maconnerie', icon: '🧱', artisan_count: 29, color: '#6B7280', gradient: 'from-gray-500 to-gray-700' },
  { id: 6, name_fr: 'Réparation', name_ar: 'إصلاح الأجهزة', slug: 'reparation', icon: '🔨', artisan_count: 52, color: '#EF4444', gradient: 'from-red-500 to-rose-700' },
  { id: 7, name_fr: 'Déménagement', name_ar: 'النقل', slug: 'demenagement', icon: '🚛', artisan_count: 24, color: '#10B981', gradient: 'from-emerald-500 to-teal-700' },
  { id: 8, name_fr: 'Nettoyage', name_ar: 'التنظيف', slug: 'nettoyage', icon: '🧹', artisan_count: 37, color: '#06B6D4', gradient: 'from-cyan-500 to-sky-700' },
];

export const MOCK_ARTISANS = [
  {
    id: 'demo-1', first_name: 'Khalid', last_name: 'Benmoussa',
    city: 'Casablanca', category_name: 'Plomberie', category_icon: '🔧', category_slug: 'plomberie',
    rating_avg: 4.9, rating_count: 47, years_experience: 12, total_jobs: 156,
    is_premium: true, is_available: true, is_verified: true, hourly_rate: 150,
    bio_fr: 'Plombier professionnel avec 12 ans d\'expérience en installation et dépannage.',
    initials: 'KB', color: '#3B82F6',
  },
  {
    id: 'demo-2', first_name: 'Hassan', last_name: 'El Fassi',
    city: 'Rabat', category_name: 'Électricité', category_icon: '⚡', category_slug: 'electricite',
    rating_avg: 4.8, rating_count: 62, years_experience: 8, total_jobs: 203,
    is_premium: true, is_available: true, is_verified: true, hourly_rate: 120,
    bio_fr: 'Électricien certifié, spécialisé en installation électrique résidentielle et commerciale.',
    initials: 'HF', color: '#F59E0B',
  },
  {
    id: 'demo-3', first_name: 'Youssef', last_name: 'Amrani',
    city: 'Marrakech', category_name: 'Menuiserie', category_icon: '🪚', category_slug: 'menuiserie',
    rating_avg: 4.7, rating_count: 38, years_experience: 15, total_jobs: 89,
    is_premium: false, is_available: true, is_verified: true, hourly_rate: 200,
    bio_fr: 'Menuisier artisan, fabrication sur mesure de meubles et boiseries.',
    initials: 'YA', color: '#92400E',
  },
  {
    id: 'demo-4', first_name: 'Rachid', last_name: 'Ouali',
    city: 'Casablanca', category_name: 'Peinture', category_icon: '🎨', category_slug: 'peinture',
    rating_avg: 4.9, rating_count: 71, years_experience: 10, total_jobs: 178,
    is_premium: true, is_available: false, is_verified: true, hourly_rate: 100,
    bio_fr: 'Peintre décorateur professionnel, intérieur et extérieur.',
    initials: 'RO', color: '#8B5CF6',
  },
  {
    id: 'demo-5', first_name: 'Nabil', last_name: 'Zouiten',
    city: 'Fès', category_name: 'Maçonnerie', category_icon: '🧱', category_slug: 'maconnerie',
    rating_avg: 4.6, rating_count: 29, years_experience: 20, total_jobs: 67,
    is_premium: false, is_available: true, is_verified: false, hourly_rate: 180,
    bio_fr: 'Maçon expérimenté, construction, rénovation et travaux de gros œuvre.',
    initials: 'NZ', color: '#6B7280',
  },
  {
    id: 'demo-6', first_name: 'Samir', last_name: 'Chraibi',
    city: 'Agadir', category_name: 'Nettoyage', category_icon: '🧹', category_slug: 'nettoyage',
    rating_avg: 4.8, rating_count: 54, years_experience: 6, total_jobs: 312,
    is_premium: true, is_available: true, is_verified: true, hourly_rate: 80,
    bio_fr: 'Société de nettoyage professionnel pour maisons, bureaux et locaux commerciaux.',
    initials: 'SC', color: '#06B6D4',
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: 1, name: 'Fatima Zahra M.', city: 'Casablanca', rating: 5,
    text: 'J\'ai trouvé un excellent plombier en moins de 10 minutes. Travail impeccable, prix transparent. Je recommande vivement M3alemConnect !',
    service: 'Plomberie', initials: 'FZ', color: '#D99000',
  },
  {
    id: 2, name: 'Ahmed Benjelloun', city: 'Rabat', rating: 5,
    text: 'Plateforme très facile à utiliser. L\'électricien est venu le jour même, professionnel et sérieux. Excellent rapport qualité-prix.',
    service: 'Électricité', initials: 'AB', color: '#065F2E',
  },
  {
    id: 3, name: 'Nadia El Idrissi', city: 'Marrakech', rating: 5,
    text: 'Le menuisier a réalisé mes placards sur mesure exactement comme je le souhaitais. Artisan talentueux, je referai appel à lui.',
    service: 'Menuiserie', initials: 'NE', color: '#001A33',
  },
  {
    id: 4, name: 'Karim Tazi', city: 'Fès', rating: 4,
    text: 'Super expérience, les avis clients m\'ont vraiment aidé à choisir. La peinture de ma maison est magnifique. Merci M3alemConnect !',
    service: 'Peinture', initials: 'KT', color: '#8B5CF6',
  },
];

export const MOROCCAN_CITIES = [
  { name: 'Casablanca', artisans: 312, emoji: '🏙️' },
  { name: 'Rabat', artisans: 187, emoji: '🏛️' },
  { name: 'Marrakech', artisans: 243, emoji: '🌴' },
  { name: 'Fès', artisans: 156, emoji: '🕌' },
  { name: 'Agadir', artisans: 134, emoji: '🌊' },
  { name: 'Tanger', artisans: 98, emoji: '⚓' },
  { name: 'Meknès', artisans: 87, emoji: '🏰' },
  { name: 'Oujda', artisans: 76, emoji: '🌄' },
];

export const TRUST_FEATURES = [
  { icon: '🛡️', title: 'Artisans vérifiés', desc: 'Chaque professionnel est contrôlé et vérifié avant d\'apparaître sur la plateforme.' },
  { icon: '⭐', title: 'Avis certifiés', desc: 'Tous les avis proviennent de clients ayant réellement utilisé le service.' },
  { icon: '💬', title: 'Devis gratuits', desc: 'Demandez plusieurs devis et comparez sans engagement, c\'est 100% gratuit.' },
  { icon: '🔒', title: 'Paiement sécurisé', desc: 'Vos données et transactions sont protégées par un chiffrement de niveau bancaire.' },
  { icon: '📞', title: 'Support 7j/7', desc: 'Notre équipe est disponible pour vous aider à tout moment de la semaine.' },
  { icon: '🇲🇦', title: '100% Marocain', desc: 'Conçu pour le marché marocain avec un support en Darija, Arabe et Français.' },
];
