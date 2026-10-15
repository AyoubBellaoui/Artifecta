import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCategories, fetchPlans, searchArtisans } from '../services/data';
import { useI18n } from '../i18n/I18nProvider';
import { planKey } from '../i18n/helpers';
import ArtisanCard from '../components/ArtisanCard';
import Avatar from '../components/Avatar';
import Icon, { CategoryIcon } from '../components/Icon';
import { CountUp, EASE, Marquee, Reveal, staggerDelay } from '../components/motion';
import PlanCard from '../components/PlanCard';
import StarRating from '../components/StarRating';
import { SectionHeading } from '../components/ui';
import ZelligePattern from '../components/ZelligePattern';
import { CITIES, CITY_STATS, FALLBACK_CATEGORIES, FALLBACK_PLANS, filterDemoArtisans } from '../data/mockData';
import { DEMO_PORTRAITS, HERO_IMAGES, TESTIMONIAL_AVATARS, categoryImage, cityImage } from '../data/images';

const TRUST_ICONS = ['shieldCheck', 'star', 'file', 'mapPin'];
const HOW_ICONS = ['search', 'users', 'file'];
const POPULAR_CATEGORIES = ['plomberie', 'electricite', 'peinture', 'nettoyage'];
const DEMO_FEATURED = filterDemoArtisans({ sort: 'rating' }).slice(0, 6);
const HOW_FACES = Object.values(DEMO_PORTRAITS).slice(0, 3);

// Hero entrance: the text column's children rise in one after the other on page load.
const HERO_TEXT = { show: { transition: { staggerChildren: 0.08 } } };
const HERO_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function ArrowLink({ to, children, className = 'btn btn-secondary' }) {
  return (
    <Link to={to} className={className}>
      {children}
      <Icon name="arrowRight" className="h-4 w-4" flipInRtl />
    </Link>
  );
}

function HeroSearch({ categories }) {
  const { t, categoryName, cityName } = useI18n();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    const query = params.toString();
    navigate(query ? `/artisans?${query}` : '/artisans');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-9 grid gap-3 rounded-xl bg-white p-3 shadow-pop sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
    >
      <div>
        <label htmlFor="hero-service" className="mb-1 block text-xs font-medium text-sand-600">{t('home.hero.service')}</label>
        <select id="hero-service" value={category} onChange={(e) => setCategory(e.target.value)} className="select h-12 text-[15px]">
          <option value="">{t('home.hero.allServices')}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{categoryName(c)}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="hero-city" className="mb-1 block text-xs font-medium text-sand-600">{t('home.hero.city')}</label>
        <select id="hero-city" value={city} onChange={(e) => setCity(e.target.value)} className="select h-12 text-[15px]">
          <option value="">{t('home.hero.allCities')}</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{cityName(c)}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-accent btn-lg h-12 font-semibold">
        <Icon name="search" className="h-4 w-4" strokeWidth={2.25} />
        {t('home.hero.submit')}
      </button>
    </form>
  );
}

function HeroPanel({ artisans }) {
  const { t, categoryName, cityName } = useI18n();

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-pop">
      <div className="flex items-center justify-between gap-4 border-b border-sand-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-navy-900">{t('home.hero.panelTitle')}</p>
          <p className="mt-0.5 text-xs text-sand-600">{t('home.hero.panelSubtitle')}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Icon name="shieldCheck" className="h-5 w-5" />
        </span>
      </div>
      <ul className="divide-y divide-sand-200">
        {artisans.map((artisan) => (
          <li key={artisan.id}>
            <Link to={`/artisans/${artisan.id}`} className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-sand-50">
              <Avatar firstName={artisan.first_name} lastName={artisan.last_name} src={artisan.avatar_url} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-900"><bdi>{artisan.first_name} {artisan.last_name}</bdi></p>
                <p className="mt-0.5 truncate text-xs text-sand-600">
                  {[categoryName(artisan), cityName(artisan.city)].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="shrink-0 text-end">
                <StarRating rating={artisan.rating_avg} size="xs" showValue />
                <p className="mt-1 text-xs text-sand-600">{t('common.reviews', { count: Number(artisan.rating_count) || 0 })}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/artisans"
        className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-5 py-3.5 text-sm font-semibold text-navy-800 transition-colors hover:bg-saffron-50 hover:text-navy-900"
      >
        {t('home.hero.panelLink')}
        <Icon name="arrowRight" className="h-4 w-4" flipInRtl />
      </Link>
    </div>
  );
}

// Photo collage on the right of the hero, with the top-rated artisans floating over its corner.
function HeroCollage({ artisans }) {
  return (
    <div className="relative">
      <div className="relative h-[280px] sm:h-[400px] lg:h-[540px]">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute inset-y-0 end-0 w-full overflow-hidden rounded-2xl bg-navy-800 sm:w-[82%]"
        >
          <img src={HERO_IMAGES.main} alt="" width={960} height={1200} fetchpriority="high" decoding="async" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="absolute start-0 top-8 hidden aspect-square w-[34%] overflow-hidden rounded-xl bg-navy-800 shadow-pop ring-4 ring-navy-900 sm:block"
        >
          <img src={HERO_IMAGES.detail} alt="" width={560} height={560} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
        className="relative z-10 mx-3 -mt-16 sm:mx-10 lg:absolute lg:-bottom-12 lg:-start-10 lg:mx-0 lg:mt-0 lg:w-[22rem]"
      >
        <HeroPanel artisans={artisans} />
      </motion.div>
    </div>
  );
}

// Small picture under each "how it works" step, showing what the step looks like in the app.
function HowIllustration({ index }) {
  const { t, categoryName, cityName } = useI18n();

  if (index === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs shadow-card ring-1 ring-sand-200">
        <Icon name="search" className="h-3.5 w-3.5 text-sand-500" />
        <span className="truncate font-medium text-navy-900">{categoryName('plomberie')}</span>
        <span className="text-sand-400">·</span>
        <span className="truncate text-sand-600">{cityName('Casablanca')}</span>
        <span className="ms-auto flex h-5 w-5 shrink-0 items-center justify-center rounded bg-saffron-500 text-navy-950">
          <Icon name="arrowRight" className="h-3 w-3" strokeWidth={2.5} flipInRtl />
        </span>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 shadow-card ring-1 ring-sand-200">
        <div className="flex -space-x-2.5 rtl:space-x-reverse">
          {HOW_FACES.map((src) => (
            <img key={src} src={src} alt="" width={32} height={32} loading="lazy" decoding="async" className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
          ))}
        </div>
        <StarRating rating={4.9} size="xs" showValue />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs shadow-card ring-1 ring-sand-200">
      <Icon name="file" className="h-4 w-4 text-navy-700" />
      <span className="flex-1 truncate text-start font-medium text-navy-900">{t('profile.requestQuote')}</span>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Icon name="check" className="h-3 w-3" strokeWidth={3} />
      </span>
    </div>
  );
}

export default function Home() {
  const { t, tm, lang, formatNumber, categoryName, cityName } = useI18n();
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [featured, setFeatured] = useState(DEMO_FEATURED);
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    // Each call keeps its demo fallback, so the page always has something to show.
    fetchCategories().then((rows) => { if (rows?.length) setCategories(rows); }).catch(() => {});
    searchArtisans({ sort: 'rating', limit: 6 }).then(({ artisans }) => { if (artisans.length) setFeatured(artisans); }).catch(() => {});
    fetchPlans().then((rows) => { if (rows?.length) setPlans(rows); }).catch(() => {});
  }, []);

  // Ticker content: each trade followed by a city.
  const tickerItems = categories.flatMap((category, index) => {
    const city = CITY_STATS[index % CITY_STATS.length].name;
    return [
      { key: `trade-${category.slug}`, icon: <CategoryIcon slug={category.slug} className="h-5 w-5 text-saffron-600" />, label: categoryName(category) },
      { key: `city-${city}`, icon: <Icon name="mapPin" className="h-4 w-4 text-navy-400" />, label: cityName(city) },
    ];
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <ZelligePattern className="text-white/[0.07] [mask-image:linear-gradient(to_left,#000_10%,transparent_65%)] rtl:[mask-image:linear-gradient(to_right,#000_10%,transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-saffron-500" aria-hidden="true" />

        <div className="container-page relative grid grid-cols-1 gap-12 pb-28 pt-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-36 lg:pt-20">
          <motion.div className="lg:col-span-7" variants={HERO_TEXT} initial="hidden" animate="show">
            <motion.p variants={HERO_ITEM} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-saffron-300">
              <span className="h-px w-8 bg-saffron-400" aria-hidden="true" />
              {t('home.hero.eyebrow')}
            </motion.p>
            <motion.h1 variants={HERO_ITEM} className="mt-5 max-w-2xl text-[40px] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[58px]">
              {t('home.hero.titleLead')}{' '}
              <span className="text-saffron-400 sm:block">{t('home.hero.titleHighlight')}</span>
            </motion.h1>
            <motion.p variants={HERO_ITEM} className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">{t('home.hero.subtitle')}</motion.p>

            <motion.div variants={HERO_ITEM}>
              <HeroSearch categories={categories} />
            </motion.div>

            <motion.div variants={HERO_ITEM} className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="me-1 text-navy-200">{t('home.hero.popular')}</span>
              {POPULAR_CATEGORIES.map((slug) => (
                <Link
                  key={slug}
                  to={`/artisans?category=${slug}`}
                  className="rounded-full border border-white/20 px-3 py-1 text-navy-50 transition-colors hover:border-saffron-400 hover:bg-white/5 hover:text-white"
                >
                  {categoryName(slug)}
                </Link>
              ))}
            </motion.div>

            <motion.dl variants={HERO_ITEM} className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6 rtl:divide-x-reverse">
              {tm('home.hero.stats').map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end px-4 first:ps-0 last:pe-0">
                  <dt className="mt-1 text-xs leading-snug text-navy-200 sm:text-sm">{stat.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight text-white">
                    <bdi dir="ltr">
                      {stat.count != null ? (
                        <CountUp
                          to={stat.count}
                          delay={0.6}
                          format={(n) => {
                            const digits = { minimumFractionDigits: stat.decimals || 0, maximumFractionDigits: stat.decimals || 0 };
                            // fr-FR groups thousands with a space, like the dictionary text ("1 200+").
                            const text = lang === 'fr' ? new Intl.NumberFormat('fr-FR', digits).format(n) : formatNumber(n, digits);
                            return text + (stat.suffix || '');
                          }}
                        />
                      ) : (
                        stat.value
                      )}
                    </bdi>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <div className="lg:col-span-5">
            <HeroCollage artisans={featured.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* Trust — overlaps the hero edge */}
      <section className="relative z-10 -mt-16 lg:-mt-20">
        <div className="container-page">
          <div className="grid gap-px overflow-hidden rounded-xl border border-sand-200 bg-sand-200 shadow-raised sm:grid-cols-2 lg:grid-cols-4">
            {tm('home.trust').map((item, index) => (
              <div key={item.title} className="bg-white p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <Icon name={TRUST_ICONS[index]} className="h-4 w-4 shrink-0 text-saffron-600" />
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-sand-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trades and cities ticker (decorative: the same links exist below) */}
      <section aria-hidden="true" className="mt-12 border-y border-sand-200 bg-white py-4">
        <Marquee duration={50} className="[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          {tickerItems.map((item) => (
            <li key={item.key} className="flex shrink-0 items-center gap-2.5 pe-10 text-sm font-medium text-navy-800">
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
              <span className="ms-8 h-1.5 w-1.5 rounded-full bg-saffron-400" />
            </li>
          ))}
        </Marquee>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('home.categories.eyebrow')}
            title={t('home.categories.title')}
            subtitle={t('home.categories.subtitle')}
            action={<ArrowLink to="/artisans">{t('home.categories.all')}</ArrowLink>}
          />
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {categories.map((category, index) => {
              const description = tm(`categories.${category.slug}.desc`);
              const count = Number(category.artisan_count) || 0;
              return (
                <Reveal key={category.slug} delay={staggerDelay(index % 4)}>
                  <Link
                    to={`/artisans?category=${category.slug}`}
                    className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-navy-800 p-4 text-white shadow-card transition-shadow duration-300 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 sm:aspect-[4/3] sm:p-5"
                  >
                    <img
                      src={categoryImage(category.slug)}
                      alt=""
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="img-zoom absolute inset-0 -z-10 h-full w-full object-cover"
                    />
                    <span className="photo-scrim -z-10" />
                    {count > 0 && (
                      <span className="absolute end-3 top-3 rounded-full bg-navy-950/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        {t('common.artisans', { count })}
                      </span>
                    )}
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-500 text-navy-950 shadow-raised">
                      <CategoryIcon slug={category.slug} className="h-5 w-5" />
                    </span>
                    <span className="mt-3 flex items-center gap-1.5 text-base font-semibold sm:text-lg">
                      {categoryName(category)}
                      <Icon
                        name="arrowRight"
                        className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        flipInRtl
                      />
                    </span>
                    {description && <span className="mt-1 hidden text-sm leading-snug text-white/85 sm:line-clamp-2">{description}</span>}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-sand-200 bg-white py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">{t('home.how.eyebrow')}</p>
            <h2 className="heading-section mt-3">{t('home.how.title')}</h2>
            <p className="lead mt-3">{t('home.how.subtitle')}</p>
            <ArrowLink to="/artisans" className="btn btn-primary mt-8">{t('home.how.cta')}</ArrowLink>
          </Reveal>
          <div className="relative lg:col-span-8">
            {/* Line joining the three steps; it draws itself in the reading direction. */}
            <div aria-hidden="true" className="absolute inset-x-[16.66%] top-8 hidden h-0.5 bg-sand-200 sm:block">
              <motion.span
                className="block h-full origin-left bg-saffron-500 rtl:origin-right"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
              />
            </div>
            <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
              {tm('home.how.steps').map((step, index) => (
                <Reveal as="li" key={step.title} delay={0.15 + index * 0.3} className="flex flex-col items-center text-center">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-saffron-400 shadow-raised ring-8 ring-white">
                    <Icon name={HOW_ICONS[index] || 'check'} className="h-7 w-7" />
                    <span className="absolute -end-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-saffron-500 text-xs font-bold text-navy-950 ring-2 ring-white">
                      {formatNumber(index + 1)}
                    </span>
                  </span>
                  <div className="mt-6 flex h-12 w-full max-w-[15rem] items-center justify-center *:w-full">
                    <HowIllustration index={index} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sand-600">{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Featured artisans */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('home.featured.eyebrow')}
            title={t('home.featured.title')}
            subtitle={t('home.featured.subtitle')}
            action={<ArrowLink to="/artisans">{t('home.featured.cta')}</ArrowLink>}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((artisan, index) => (
              <Reveal key={artisan.id} delay={staggerDelay(index % 3)} className="grid">
                <ArtisanCard artisan={artisan} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-sand-200 bg-sand-100 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('home.testimonials.eyebrow')} title={t('home.testimonials.title')} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {tm('home.testimonials.items').map((item, index) => (
              <Reveal as="figure" key={item.name} delay={staggerDelay(index)} className="card flex flex-col p-6 transition-shadow duration-300 hover:shadow-raised">
                <svg aria-hidden="true" viewBox="0 0 32 32" fill="currentColor" className="h-8 w-8 text-saffron-400 rtl:-scale-x-100">
                  <path d="M13 7C7.5 9.2 4 13.4 4 19v6h9v-9H8.6c.4-3.3 2.3-5.6 5.6-7.2L13 7Zm15 0c-5.5 2.2-9 6.4-9 12v6h9v-9h-4.4c.4-3.3 2.3-5.6 5.6-7.2L28 7Z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-navy-900">{item.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-sand-200 pt-4">
                  {TESTIMONIAL_AVATARS[index] && (
                    <img
                      src={TESTIMONIAL_AVATARS[index]}
                      alt=""
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
                      className="h-11 w-11 shrink-0 rounded-full bg-sand-200 object-cover ring-2 ring-saffron-200"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-sand-600">{categoryName(item.service)} · {item.city}</p>
                  </div>
                  <StarRating rating={5} size="xs" />
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">{t('home.cities.eyebrow')}</p>
            <h2 className="heading-section mt-3">{t('home.cities.title')}</h2>
            <p className="lead mt-3">{t('home.cities.subtitle')}</p>
          </Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-8">
            {CITY_STATS.map((city, index) => (
              <Reveal as="li" key={city.name} delay={staggerDelay(index % 4)}>
                <Link
                  to={`/artisans?city=${encodeURIComponent(city.name)}`}
                  className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-navy-800 p-4 text-white shadow-card transition-shadow duration-300 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2"
                >
                  <img
                    src={cityImage(city.name)}
                    alt=""
                    width={600}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="img-zoom absolute inset-0 -z-10 h-full w-full object-cover"
                  />
                  <span className="photo-scrim -z-10" />
                  <span className="flex items-center gap-1.5 text-base font-semibold">
                    <Icon name="mapPin" className="h-4 w-4 text-saffron-400" />
                    {cityName(city.name)}
                  </span>
                  <span className="mt-1 flex items-center justify-between gap-2 text-xs text-white/85">
                    {t('common.artisans', { count: city.artisans })}
                    <Icon name="arrowRight" className="h-4 w-4 text-saffron-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" flipInRtl />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* For artisans + plans */}
      <section className="border-t border-sand-200 py-16 sm:py-20">
        <div className="container-page">
          <Reveal className="relative grid gap-10 overflow-hidden rounded-xl bg-navy-900 p-8 text-white sm:p-12 lg:grid-cols-12 lg:gap-12">
            <ZelligePattern className="text-white/[0.05]" />
            <div className="relative lg:col-span-7">
              <p className="eyebrow text-saffron-300">{t('home.pro.eyebrow')}</p>
              <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">{t('home.pro.title')}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-navy-100">{t('home.pro.text')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register?role=artisan" className="btn btn-accent btn-lg font-semibold">{t('home.pro.cta')}</Link>
                <a href="#plans" className="btn btn-on-dark btn-lg">{t('home.pro.secondary')}</a>
              </div>
            </div>
            <ul className="relative space-y-4 self-center lg:col-span-5">
              {tm('home.pro.benefits').map((benefit) => (
                <li key={benefit} className="flex gap-3 text-[15px] leading-relaxed text-navy-50">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-navy-950">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>

          <div id="plans" className="mt-16 scroll-mt-24">
            <SectionHeading eyebrow={t('home.plans.eyebrow')} title={t('home.plans.title')} subtitle={t('home.plans.subtitle')} />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const highlighted = planKey(plan) === 'pro';
                return (
                  <Reveal key={plan.id} delay={staggerDelay(index)} className="grid">
                    <PlanCard
                      plan={plan}
                      highlighted={highlighted}
                      action={
                        <Link to="/register?role=artisan" className={`btn w-full ${highlighted ? 'btn-accent' : 'btn-secondary'}`}>
                          {Number(plan.price) === 0
                            ? t('home.plans.ctaFree')
                            : t('home.plans.ctaPaid', { plan: t(`plans.${planKey(plan)}.name`) })}
                        </Link>
                      }
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-sand-200 bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">{t('home.faq.eyebrow')}</p>
            <h2 className="heading-section mt-3">{t('home.faq.title')}</h2>
            <p className="lead mt-3">{t('home.faq.subtitle')}</p>
          </Reveal>
          <Reveal delay={0.1} className="divide-y divide-sand-200 border-y border-sand-200 lg:col-span-8">
            {tm('home.faq.items').map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-navy-900 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand-100 text-navy-700 transition-colors group-open:bg-saffron-500 group-open:text-navy-950">
                    <Icon name="plus" className="h-4 w-4 transition-transform duration-200 group-open:rotate-45" strokeWidth={2.25} />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-sand-600">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Final call to action */}
      <section className="relative overflow-hidden bg-saffron-500">
        <ZelligePattern className="text-navy-950/[0.06]" />
        <Reveal className="container-page relative flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-navy-950 sm:text-[30px]">{t('home.finalCta.title')}</h2>
            <p className="mt-2 text-navy-900/80">{t('home.finalCta.text')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/artisans" className="btn btn-primary btn-lg">{t('home.finalCta.primary')}</Link>
            <Link
              to="/register?role=artisan"
              className="btn btn-lg border border-navy-950/20 bg-white/50 text-navy-950 hover:bg-white/80"
            >
              {t('home.finalCta.secondary')}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
