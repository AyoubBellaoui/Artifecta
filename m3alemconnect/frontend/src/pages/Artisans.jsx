import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchCategories, searchArtisans } from '../services/data';
import { useI18n } from '../i18n/I18nProvider';
import ArtisanCard from '../components/ArtisanCard';
import Icon, { CategoryIcon } from '../components/Icon';
import { Reveal, staggerDelay } from '../components/motion';
import ZelligePattern from '../components/ZelligePattern';
import { EmptyState, Notice } from '../components/ui';
import { CITIES, FALLBACK_CATEGORIES, filterDemoArtisans } from '../data/mockData';
import { categoryImage } from '../data/images';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  ['rating', 'artisans.sortRating'],
  ['jobs', 'artisans.sortJobs'],
  ['premium', 'artisans.sortPremium'],
  ['newest', 'artisans.sortNewest'],
];

const RATING_OPTIONS = [
  ['', 'artisans.anyRating'],
  ['4', 'artisans.rating4'],
  ['4.5', 'artisans.rating45'],
  ['5', 'artisans.rating5'],
];

const POPULAR_CATEGORIES = ['plomberie', 'electricite', 'peinture', 'nettoyage'];

function FilterOption({ active, onClick, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-sm transition-colors ${
        active ? 'bg-navy-50 font-medium text-navy-900' : 'text-sand-700 hover:bg-sand-100 hover:text-navy-900'
      }`}
    >
      {icon && <span className={active ? 'text-navy-700' : 'text-sand-500'}>{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton h-28 rounded-none" />
          <div className="flex justify-between gap-4 px-5 pb-5 pt-11">
            <div className="flex-1 space-y-2.5">
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 px-5 pb-5">
            <div className="skeleton h-6 w-24" />
            <div className="skeleton h-3 w-20" />
          </div>
          <div className="border-t border-sand-200 bg-sand-50 px-5 py-3">
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Artisans() {
  const { t, categoryName, cityName } = useI18n();
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [result, setResult] = useState({ artisans: [], total: 0, pages: 1, demo: false });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const demoMode = useRef(false);

  const search = params.get('search') || '';
  const city = params.get('city') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'rating';
  const available = params.get('available') || '';
  const minRating = params.get('min_rating') || '';
  const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
  const [query, setQuery] = useState(search);

  const updateParams = useCallback(
    (changes) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
          if (!Object.prototype.hasOwnProperty.call(changes, 'page')) next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  // Keep the input in sync when the URL changes elsewhere (back button, footer links).
  useEffect(() => {
    setQuery((current) => (current.trim() === search ? current : search));
  }, [search]);

  useEffect(() => {
    if (query.trim() === search) return undefined;
    const timer = setTimeout(() => updateParams({ search: query.trim() }), 350);
    return () => clearTimeout(timer);
  }, [query, search, updateParams]);

  useEffect(() => {
    fetchCategories().then((rows) => { if (rows?.length) setCategories(rows); }).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const filters = { search, city, category, minRating, available, sort };
    const hasFilters = Boolean(search || city || category || minRating || available);
    const showDemo = () => {
      demoMode.current = true;
      const artisans = filterDemoArtisans(filters);
      setResult({ artisans, total: artisans.length, pages: 1, demo: true });
    };

    setLoading(true);
    searchArtisans({ ...filters, page, limit: PAGE_SIZE })
      .then((data) => {
        if (cancelled) return;
        // A platform with no artisans yet is presented with the demo profiles.
        if (!data.total && (!hasFilters || demoMode.current)) {
          showDemo();
        } else {
          demoMode.current = false;
          setResult({ ...data, demo: false });
        }
      })
      .catch(() => {
        if (!cancelled) showDemo();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, city, category, sort, page, available, minRating]);

  const activeFilters = [category, city, available, minRating].filter(Boolean).length;
  const resetFilters = () => {
    setQuery('');
    updateParams({ search: '', category: '', city: '', available: '', min_rating: '' });
  };
  const goToPage = (nextPage) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : '' });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      {/* Search header, in the same navy band as the home page hero */}
      <div className="relative overflow-hidden bg-navy-900">
        {/* The chosen trade's photo, faded behind the header */}
        {category && (
          <img
            key={category}
            src={categoryImage(category, 'wide')}
            alt=""
            width={1600}
            height={500}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <ZelligePattern className="text-white/[0.07] [mask-image:linear-gradient(to_left,#000_10%,transparent_70%)] rtl:[mask-image:linear-gradient(to_right,#000_10%,transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-saffron-500" aria-hidden="true" />

        <div className="container-page relative py-10 sm:py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[32px]">{t('artisans.title')}</h1>
          <p className="mt-2 max-w-xl text-navy-100">{t('artisans.subtitle')}</p>

          <div className="mt-7 grid gap-3 rounded-xl bg-white p-3 shadow-pop sm:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="relative">
              <label htmlFor="artisan-search" className="sr-only">{t('artisans.searchLabel')}</label>
              <Icon name="search" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-500" />
              <input
                id="artisan-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('artisans.searchPlaceholder')}
                className="input h-12 ps-10 text-[15px]"
              />
            </div>
            <div>
              <label htmlFor="artisan-city" className="sr-only">{t('artisans.city')}</label>
              <select id="artisan-city" value={city} onChange={(e) => updateParams({ city: e.target.value })} className="select h-12 text-[15px]">
                <option value="">{t('artisans.allCities')}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{cityName(c)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="me-1 text-navy-200">{t('home.hero.popular')}</span>
            {POPULAR_CATEGORIES.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => updateParams({ category: category === slug ? '' : slug })}
                aria-pressed={category === slug}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  category === slug
                    ? 'border-saffron-400 bg-saffron-500 font-medium text-navy-950'
                    : 'border-white/20 text-navy-50 hover:border-saffron-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {categoryName(slug)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
          <aside className={`${filtersOpen ? 'block' : 'hidden'} mb-6 lg:mb-0 lg:block`}>
            <div className="card p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-navy-900">{t('artisans.filters')}</h2>
                {(activeFilters > 0 || search) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-medium text-navy-700 underline decoration-sand-300 underline-offset-4 hover:text-navy-900"
                  >
                    {t('artisans.reset')}
                  </button>
                )}
              </div>

              <fieldset className="mt-5">
                <legend className="text-xs font-semibold uppercase tracking-[0.06em] text-sand-600">{t('artisans.category')}</legend>
                <ul className="mt-2 space-y-0.5">
                  <li>
                    <FilterOption active={!category} onClick={() => updateParams({ category: '' })} label={t('artisans.allCategories')} />
                  </li>
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <FilterOption
                        active={category === c.slug}
                        onClick={() => updateParams({ category: c.slug })}
                        label={categoryName(c)}
                        icon={<CategoryIcon slug={c.slug} className="h-4 w-4" />}
                      />
                    </li>
                  ))}
                </ul>
              </fieldset>

              <div className="mt-5 border-t border-sand-200 pt-5">
                <label htmlFor="min-rating" className="text-xs font-semibold uppercase tracking-[0.06em] text-sand-600">
                  {t('artisans.minRating')}
                </label>
                <select id="min-rating" value={minRating} onChange={(e) => updateParams({ min_rating: e.target.value })} className="select mt-2 h-10">
                  {RATING_OPTIONS.map(([value, key]) => (
                    <option key={key} value={value}>{t(key)}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5 border-t border-sand-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-sand-600">{t('artisans.availability')}</p>
                <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 text-sm text-navy-900">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={available === 'true'}
                    onChange={(e) => updateParams({ available: e.target.checked ? 'true' : '' })}
                  />
                  {t('artisans.availableOnly')}
                </label>
              </div>

              <div className="mt-5 border-t border-sand-200 pt-5">
                <p className="text-sm font-medium text-navy-900">{t('home.pro.eyebrow')}</p>
                <p className="mt-1 text-xs leading-relaxed text-sand-600">{t('artisans.proTeaser')}</p>
                <Link to="/register?role=artisan" className="btn btn-secondary btn-sm mt-3 w-full">
                  {t('nav.becomeArtisan')}
                </Link>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-navy-900" aria-live="polite">
                {loading && result.artisans.length === 0 ? t('artisans.searching') : t('artisans.results', { count: result.total })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  className="btn btn-secondary btn-sm lg:hidden"
                >
                  <Icon name="sliders" className="h-4 w-4" />
                  {t('artisans.filters')}
                  {activeFilters > 0 && <span className="rounded bg-navy px-1.5 text-xs text-white">{activeFilters}</span>}
                </button>
                <label htmlFor="artisan-sort" className="hidden text-sm text-sand-600 sm:inline">{t('artisans.sort')}</label>
                <select
                  id="artisan-sort"
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value === 'rating' ? '' : e.target.value })}
                  className="select h-9 w-auto min-w-[10.5rem]"
                >
                  {SORT_OPTIONS.map(([value, key]) => (
                    <option key={value} value={value}>{t(key)}</option>
                  ))}
                </select>
              </div>
            </div>

            {result.demo && <Notice className="mb-5">{t('artisans.demoNotice')}</Notice>}

            {loading && result.artisans.length === 0 ? (
              <ResultsSkeleton />
            ) : result.artisans.length === 0 ? (
              <EmptyState
                icon="search"
                title={t('artisans.emptyTitle')}
                text={t('artisans.emptyText')}
                action={
                  activeFilters > 0 || search ? (
                    <button type="button" onClick={resetFilters} className="btn btn-secondary">{t('artisans.reset')}</button>
                  ) : null
                }
              />
            ) : (
              <>
                <div
                  className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${loading ? 'opacity-60' : ''}`}
                  aria-busy={loading}
                >
                  {result.artisans.map((artisan, index) => (
                    <Reveal key={artisan.id} delay={staggerDelay(index % 3)} className="grid">
                      <ArtisanCard artisan={artisan} />
                    </Reveal>
                  ))}
                </div>

                {result.pages > 1 && (
                  <nav className="mt-8 flex items-center justify-between gap-3 border-t border-sand-200 pt-5">
                    <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)} className="btn btn-secondary btn-sm">
                      <Icon name="arrowLeft" className="h-4 w-4" flipInRtl />
                      {t('artisans.previous')}
                    </button>
                    <span className="text-sm text-sand-600">{t('artisans.pageOf', { page, pages: result.pages })}</span>
                    <button type="button" disabled={page >= result.pages} onClick={() => goToPage(page + 1)} className="btn btn-secondary btn-sm">
                      {t('artisans.next')}
                      <Icon name="arrowRight" className="h-4 w-4" flipInRtl />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
