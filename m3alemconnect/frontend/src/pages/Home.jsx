import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import { MOCK_CATEGORIES, MOCK_ARTISANS, MOCK_TESTIMONIALS, MOROCCAN_CITIES, TRUST_FEATURES } from '../data/mockData';

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Agadir','Tanger','Meknès','Oujda','Tétouan','Salé'];

const STATS = [
  { value: '2 000+', label: 'Artisans vérifiés', icon: '🔧' },
  { value: '15 000+', label: 'Clients satisfaits', icon: '😊' },
  { value: '12', label: 'Villes couvertes', icon: '📍' },
  { value: '4.8★', label: 'Note moyenne', icon: '⭐' },
];

function SearchBar() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (city) p.set('city', city);
    navigate(`/artisans?${p.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden p-1.5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Quel artisan cherchez-vous ? ex: plombier..."
          className="flex-1 px-5 py-3.5 text-navy placeholder:text-gray-400 focus:outline-none text-sm bg-transparent"
        />
        <div className="w-px bg-gray-100 hidden sm:block my-2" />
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="sm:w-44 px-4 py-3.5 text-navy text-sm focus:outline-none bg-transparent cursor-pointer"
        >
          <option value="">📍 Toutes les villes</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="bg-saffron hover:bg-saffron-600 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all active:scale-95 whitespace-nowrap">
          Rechercher →
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Plombier', 'Électricien', 'Peintre', 'Déménageur', 'Menuisier'].map(s => (
          <button key={s} type="button" onClick={() => { setSearch(s); navigate(`/artisans?search=${s}`); }}
            className="text-white/60 hover:text-white text-xs border border-white/20 hover:border-white/40 px-3 py-1 rounded-full transition-all">
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}

export default function Home() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [featured, setFeatured] = useState(MOCK_ARTISANS);
  const [plans, setPlans] = useState([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    api.get('/categories').then(r => { if (r.data?.length) setCategories(r.data); }).catch(() => {});
    api.get('/artisans?sort=premium&limit=6').then(r => { if (r.data?.artisans?.length) setFeatured(r.data.artisans); }).catch(() => {});
    api.get('/subscriptions/plans').then(r => setPlans(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % MOCK_TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="gradient-navy relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        {/* Glow blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left content */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-saffron/10 border border-saffron/20 text-saffron rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
                🇲🇦 La marketplace marocaine de confiance
              </div>
              <h1 className="font-display font-bold text-white text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
                <span className="block text-white/90">الحرفي المناسب</span>
                <span className="block text-saffron mt-1">وقت ما تحتاج</span>
              </h1>
              <p className="text-white/65 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
                Trouvez des artisans <strong className="text-white/90">qualifiés et vérifiés</strong> près de chez vous — plombiers, électriciens, menuisiers, peintres et plus encore.
              </p>
              <SearchBar />
            </motion.div>

            {/* Right: floating cards */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block flex-shrink-0 relative w-80">
              {/* Main artisan card */}
              <div className="bg-white rounded-2xl shadow-2xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">KB</div>
                  <div>
                    <div className="font-bold text-navy text-sm">Khalid Benmoussa</div>
                    <div className="text-gray-400 text-xs flex items-center gap-1">🔧 Plombier · Casablanca</div>
                  </div>
                  <div className="ml-auto w-2.5 h-2.5 bg-emerald rounded-full" />
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {'★★★★★'.split('').map((s, i) => <span key={i} className="text-saffron text-sm">{s}</span>)}
                  <span className="text-gray-500 text-xs ml-1">4.9 (47 avis)</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="badge-emerald">✓ Vérifié</span>
                  <span className="badge-saffron">⭐ Premium</span>
                  <span className="badge-navy">12 ans exp.</span>
                </div>
              </div>
              {/* Floating stats */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-10 top-0 bg-saffron text-white rounded-2xl shadow-xl px-4 py-3 text-center">
                <div className="font-bold text-xl">2k+</div>
                <div className="text-xs opacity-80">Artisans</div>
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-8 bottom-8 bg-emerald text-white rounded-2xl shadow-xl px-4 py-3 text-center">
                <div className="font-bold text-xl">4.8★</div>
                <div className="text-xs opacity-80">Note moy.</div>
              </motion.div>
              {/* Request card */}
              <div className="glass rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-saffron/20 rounded-xl flex items-center justify-center text-lg">📋</div>
                <div>
                  <div className="text-white text-xs font-semibold">Nouveau devis reçu</div>
                  <div className="text-white/50 text-xs">il y a 2 minutes</div>
                </div>
                <div className="ml-auto w-2 h-2 bg-saffron rounded-full animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-cream">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <section className="bg-cream py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-200">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center px-6 py-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display font-bold text-3xl text-navy">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center">— Nos services</div>
            <h2 className="section-title">Tous les corps de métier</h2>
            <p className="section-subtitle max-w-xl mx-auto">Des professionnels qualifiés pour chaque besoin, disponibles dans votre ville.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id || cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/artisans?category=${cat.slug}`}
                  className="group block rounded-2xl overflow-hidden card-hover border border-gray-100 hover:border-saffron/30">
                  {/* Colored top band */}
                  <div className={`h-2 bg-gradient-to-r ${cat.gradient || 'from-navy to-navy-700'}`} />
                  <div className="p-5 bg-white">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">{cat.icon}</div>
                    <div className="font-display font-bold text-navy text-sm mb-0.5">{cat.name_fr}</div>
                    <div className="text-gray-400 text-xs">{cat.name_ar}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{cat.artisan_count || 0} artisans</span>
                      <span className="text-saffron text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="bg-cream py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="section-label justify-center">— Simple & rapide</div>
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="section-subtitle">En 3 étapes, trouvez et contactez l'artisan qu'il vous faut.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-saffron/20 via-saffron to-saffron/20 z-0" />
            {[
              { n: '01', icon: '🔍', title: 'Recherchez', desc: 'Choisissez votre métier et votre ville. Notre moteur de recherche trouve les meilleurs artisans en quelques secondes.', color: 'from-saffron to-saffron-600' },
              { n: '02', icon: '👀', title: 'Comparez', desc: 'Consultez les profils complets, les notes, les avis clients vérifiés et les portfolios photos.', color: 'from-navy to-navy-700' },
              { n: '03', icon: '✅', title: 'Contactez', desc: 'Envoyez une demande de devis gratuite et démarrez votre projet en toute confiance.', color: 'from-emerald to-emerald-700' },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                className="relative z-10 bg-white rounded-2xl p-7 shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-navy text-xl mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/artisans" className="btn-primary px-8 py-3.5 text-sm">
              Trouver mon artisan maintenant →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED ARTISANS
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="section-label">— Top artisans</div>
              <h2 className="section-title">Artisans en vedette</h2>
              <p className="section-subtitle">Les professionnels les mieux notés de la plateforme.</p>
            </div>
            <Link to="/artisans" className="btn-outline py-2.5 px-6 text-sm self-start md:self-auto">
              Voir tous les artisans →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map((a, i) => <ArtisanCard key={a.id} artisan={a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST / WHY US
      ═══════════════════════════════════════════ */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center">— Pourquoi nous choisir</div>
            <h2 className="section-title">La confiance avant tout</h2>
            <p className="section-subtitle max-w-xl mx-auto">M3alemConnect garantit qualité, transparence et sécurité à chaque mission.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRUST_FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-saffron/30 hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-display font-bold text-navy text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section className="gradient-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center text-saffron">— Avis clients</div>
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl">Ce que disent nos clients</h2>
          </div>

          {/* Testimonial slider */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={testimonialIdx}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 border border-white/10 rounded-3xl p-8 md:p-10 max-w-2xl mx-auto text-center">
                <div className="text-4xl mb-4">❝</div>
                <p className="text-white text-lg leading-relaxed mb-6 italic">
                  {MOCK_TESTIMONIALS[testimonialIdx].text}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: MOCK_TESTIMONIALS[testimonialIdx].color }}>
                    {MOCK_TESTIMONIALS[testimonialIdx].initials}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{MOCK_TESTIMONIALS[testimonialIdx].name}</div>
                    <div className="text-white/50 text-xs">{MOCK_TESTIMONIALS[testimonialIdx].city} · {MOCK_TESTIMONIALS[testimonialIdx].service}</div>
                  </div>
                  <div className="ml-2 stars text-saffron text-sm">
                    {'★'.repeat(MOCK_TESTIMONIALS[testimonialIdx].rating)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {MOCK_TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? 'w-6 h-2 bg-saffron' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`} />
              ))}
            </div>
          </div>

          {/* Mini stats row */}
          <div className="grid grid-cols-3 gap-4 mt-14 max-w-xl mx-auto">
            {[['98%', 'de satisfaction'], ['24h', 'temps de réponse'], ['0', 'frais cachés']].map(([v, l], i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-saffron text-2xl">{v}</div>
                <div className="text-white/50 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CITIES
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center">— Couverture nationale</div>
            <h2 className="section-title">Disponible dans tout le Maroc</h2>
            <p className="section-subtitle">Des artisans qualifiés dans les principales villes du royaume.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOROCCAN_CITIES.map((city, i) => (
              <motion.div key={city.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/artisans?city=${city.name}`}
                  className="group block bg-cream hover:bg-navy rounded-2xl p-5 text-center transition-all duration-300 border border-gray-100 hover:border-navy card-hover">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{city.emoji}</div>
                  <div className="font-display font-bold text-navy group-hover:text-white text-sm transition-colors">{city.name}</div>
                  <div className="text-gray-400 group-hover:text-white/60 text-xs mt-0.5 transition-colors">{city.artisans} artisans</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ARTISAN CTA (split)
      ═══════════════════════════════════════════ */}
      <section className="bg-cream py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="gradient-emerald rounded-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left */}
              <div className="flex-1 p-10 md:p-14">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  🔧 Pour les artisans
                </div>
                <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
                  Développez votre activité avec M3alemConnect
                </h2>
                <p className="text-white/75 text-base leading-relaxed mb-8 max-w-md">
                  Créez votre profil professionnel, recevez des demandes de devis qualifiées et développez votre clientèle au Maroc.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/register?role=artisan" className="bg-saffron hover:bg-saffron-600 text-white font-bold py-3.5 px-7 rounded-xl transition-all active:scale-95 text-sm shadow-lg">
                    Créer mon profil gratuit →
                  </Link>
                  <Link to="/artisans" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-7 rounded-xl transition-all text-sm border border-white/20">
                    Voir un exemple
                  </Link>
                </div>
              </div>
              {/* Right: benefits */}
              <div className="md:w-80 bg-black/10 p-10 flex flex-col justify-center gap-4">
                {[
                  { icon: '📈', text: 'Plus de visibilité en ligne' },
                  { icon: '💼', text: 'Recevez des devis qualifiés' },
                  { icon: '⭐', text: 'Construisez votre réputation' },
                  { icon: '💰', text: 'Abonnement à partir de 0 MAD' },
                  { icon: '📱', text: 'Gérez tout depuis votre dashboard' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-white">
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-sm font-medium">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SUBSCRIPTION PLANS
      ═══════════════════════════════════════════ */}
      <SubscriptionSection plans={plans} />

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
              Prêt à démarrer ?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Rejoignez des milliers de Marocains qui font confiance à M3alemConnect pour trouver les meilleurs artisans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/artisans" className="btn-primary px-8 py-4 text-sm shadow-2xl">
                🔍 Trouver un artisan
              </Link>
              <Link to="/register" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all text-sm inline-flex items-center justify-center">
                Créer un compte gratuit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

/* ─── Subscription Plans Section ─── */
const FALLBACK_PLANS = [
  { id: 1, name: 'Gratuit', price: 0, features: ['Profil de base', 'Visible dans la recherche', '5 devis par mois', 'Support par email'] },
  { id: 2, name: 'Pro', price: 199, features: ['Profil mis en avant', 'Badge Vérifié Pro', 'Devis illimités', 'Statistiques du profil', 'Support prioritaire'] },
  { id: 3, name: 'Premium', price: 399, features: ['Position sponsorisée', 'Badge Premium ✨', 'Devis illimités', 'Statistiques avancées', 'Support dédié 24/7', 'Mise en avant catégorie'] },
];

function SubscriptionSection({ plans }) {
  const displayPlans = plans?.length ? plans : FALLBACK_PLANS;
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="section-label justify-center">— Pour les artisans</div>
          <h2 className="section-title">Choisissez votre plan</h2>
          <p className="section-subtitle">Commencez gratuitement, évoluez selon vos besoins.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPlans.map((plan, i) => {
            const popular = i === 1;
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl border-2 p-7 transition-all ${popular ? 'border-saffron shadow-2xl shadow-saffron/10 scale-105' : 'border-gray-200 hover:border-saffron/40 hover:shadow-lg'}`}>
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-saffron text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ Le plus populaire
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-lg ${popular ? 'bg-saffron/10' : 'bg-cream'}`}>
                  {i === 0 ? '🆓' : i === 1 ? '🚀' : '👑'}
                </div>
                <h3 className="font-display font-bold text-navy text-xl mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-5">
                  {plan.price === 0 ? (
                    <span className="font-display font-bold text-4xl text-navy">Gratuit</span>
                  ) : (
                    <>
                      <span className="font-display font-bold text-4xl text-navy">{plan.price}</span>
                      <span className="text-gray-400 text-sm">MAD / mois</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-7">
                  {(plan.features || []).map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="text-emerald font-bold mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register?role=artisan"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${popular ? 'btn-primary shadow-lg' : i === 2 ? 'btn-emerald' : 'btn-outline'}`}>
                  {plan.price === 0 ? 'Commencer gratuitement' : `Souscrire au plan ${plan.name}`}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
