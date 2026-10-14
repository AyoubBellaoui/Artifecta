import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories, fetchPlans, searchArtisans } from '../services/data';
import { useI18n } from '../i18n/I18nProvider';
import { planKey } from '../i18n/helpers';
import ArtisanCard from '../components/ArtisanCard';
import Avatar from '../components/Avatar';
import Icon, { CategoryIcon } from '../components/Icon';
import PlanCard from '../components/PlanCard';
import StarRating from '../components/StarRating';
import { SectionHeading } from '../components/ui';
import ZelligePattern from '../components/ZelligePattern';
import { CITIES, CITY_STATS, FALLBACK_CATEGORIES, FALLBACK_PLANS, filterDemoArtisans } from '../data/mockData';

const TRUST_ICONS = ['shieldCheck', 'star', 'file', 'mapPin'];
const POPULAR_CATEGORIES = ['plomberie', 'electricite', 'peinture', 'nettoyage'];
const DEMO_FEATURED = filterDemoArtisans({ sort: 'rating' }).slice(0, 6);

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

export default function Home() {
  const { t, tm, formatNumber, categoryName, cityName } = useI18n();
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [featured, setFeatured] = useState(DEMO_FEATURED);
  const [plans, setPlans] = useState(FALLBACK_PLANS);

  useEffect(() => {
    // Each call keeps its demo fallback, so the page always has something to show.
    fetchCategories().then((rows) => { if (rows?.length) setCategories(rows); }).catch(() => {});
    searchArtisans({ sort: 'rating', limit: 6 }).then(({ artisans }) => { if (artisans.length) setFeatured(artisans); }).catch(() => {});
    fetchPlans().then((rows) => { if (rows?.length) setPlans(rows); }).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <ZelligePattern className="text-white/[0.07] [mask-image:linear-gradient(to_left,#000_10%,transparent_65%)] rtl:[mask-image:linear-gradient(to_right,#000_10%,transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-saffron-500" aria-hidden="true" />

        <div className="container-page relative grid gap-12 pb-28 pt-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-36 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-saffron-300">
              <span className="h-px w-8 bg-saffron-400" aria-hidden="true" />
              {t('home.hero.eyebrow')}
            </p>
            <h1 className="mt-5 max-w-2xl text-[40px] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[58px]">
              {t('home.hero.titleLead')}{' '}
              <span className="text-saffron-400 sm:block">{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">{t('home.hero.subtitle')}</p>

            <HeroSearch categories={categories} />

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
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
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6 rtl:divide-x-reverse">
              {tm('home.hero.stats').map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end px-4 first:ps-0 last:pe-0">
                  <dt className="mt-1 text-xs leading-snug text-navy-200 sm:text-sm">{stat.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight text-white">
                    <bdi dir="ltr">{stat.value}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <HeroPanel artisans={featured.slice(0, 3)} />
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

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('home.categories.eyebrow')}
            title={t('home.categories.title')}
            subtitle={t('home.categories.subtitle')}
            action={<ArrowLink to="/artisans">{t('home.categories.all')}</ArrowLink>}
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const description = tm(`categories.${category.slug}.desc`);
              const count = Number(category.artisan_count) || 0;
              return (
                <Link
                  key={category.slug}
                  to={`/artisans?category=${category.slug}`}
                  className="card group flex flex-col p-5 transition-colors hover:border-saffron-400 hover:bg-saffron-50"
                >
                  <span className="flex items-start justify-between gap-3">
                    <CategoryIcon slug={category.slug} className="h-7 w-7 text-navy-700 transition-colors group-hover:text-saffron-700" />
                    {count > 0 && <span className="text-xs font-medium text-sand-500">{t('common.artisans', { count })}</span>}
                  </span>
                  <span className="mt-6 block font-semibold text-navy-900">{categoryName(category)}</span>
                  {description && <span className="mt-1 block text-sm leading-snug text-sand-600">{description}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-sand-200 bg-white py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t('home.how.eyebrow')}</p>
            <h2 className="heading-section mt-3">{t('home.how.title')}</h2>
            <p className="lead mt-3">{t('home.how.subtitle')}</p>
            <ArrowLink to="/artisans" className="btn btn-primary mt-8">{t('home.how.cta')}</ArrowLink>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-sand-200 bg-sand-200 sm:grid-cols-3 lg:col-span-8">
            {tm('home.how.steps').map((step, index, steps) => (
              <li key={step.title} className="bg-white p-6">
                {/* Progress through the steps, so the cards read as a sequence */}
                <div className="flex items-center gap-3">
                  <bdi dir="ltr" className="text-sm font-semibold text-saffron-700">
                    {formatNumber(index + 1)}/{formatNumber(steps.length)}
                  </bdi>
                  <span className="h-1 flex-1 rounded-full bg-sand-200">
                    <span className="block h-1 rounded-full bg-saffron-500" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-600">{step.text}</p>
              </li>
            ))}
          </ol>
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
            {featured.slice(0, 6).map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-sand-200 bg-sand-100 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('home.testimonials.eyebrow')} title={t('home.testimonials.title')} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {tm('home.testimonials.items').map((item) => (
              <figure key={item.name} className="card flex flex-col p-6">
                <blockquote className="flex-1 text-base leading-relaxed text-navy-900">{item.text}</blockquote>
                <figcaption className="mt-6 flex items-end justify-between gap-3 border-t border-sand-200 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-sand-600">{categoryName(item.service)} · {item.city}</p>
                  </div>
                  <StarRating rating={5} size="xs" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t('home.cities.eyebrow')}</p>
            <h2 className="heading-section mt-3">{t('home.cities.title')}</h2>
            <p className="lead mt-3">{t('home.cities.subtitle')}</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-xl border border-sand-200 bg-sand-200 sm:grid-cols-2 lg:col-span-8">
            {CITY_STATS.map((city) => (
              <li key={city.name} className="bg-white">
                <Link
                  to={`/artisans?city=${encodeURIComponent(city.name)}`}
                  className="group flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-saffron-50"
                >
                  <span className="flex items-center gap-3">
                    <Icon name="mapPin" className="h-4 w-4 text-saffron-600" />
                    <span className="font-medium text-navy-900">{cityName(city.name)}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm text-sand-600">
                    {t('common.artisans', { count: city.artisans })}
                    <Icon name="arrowRight" className="h-4 w-4 text-sand-400 transition-colors group-hover:text-navy" flipInRtl />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* For artisans + plans */}
      <section className="border-t border-sand-200 py-16 sm:py-20">
        <div className="container-page">
          <div className="relative grid gap-10 overflow-hidden rounded-xl bg-navy-900 p-8 text-white sm:p-12 lg:grid-cols-12 lg:gap-12">
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
          </div>

          <div id="plans" className="mt-16 scroll-mt-24">
            <SectionHeading eyebrow={t('home.plans.eyebrow')} title={t('home.plans.title')} subtitle={t('home.plans.subtitle')} />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => {
                const highlighted = planKey(plan) === 'pro';
                return (
                  <PlanCard
                    key={plan.id}
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
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-sand-200 bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t('home.faq.eyebrow')}</p>
            <h2 className="heading-section mt-3">{t('home.faq.title')}</h2>
            <p className="lead mt-3">{t('home.faq.subtitle')}</p>
          </div>
          <div className="divide-y divide-sand-200 border-y border-sand-200 lg:col-span-8">
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
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="relative overflow-hidden bg-saffron-500">
        <ZelligePattern className="text-navy-950/[0.06]" />
        <div className="container-page relative flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
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
        </div>
      </section>
    </>
  );
}
