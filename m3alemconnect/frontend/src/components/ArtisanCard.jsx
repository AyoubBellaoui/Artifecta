import { Link } from 'react-router-dom';
import { artisanPhoto, categoryImage } from '../data/images';
import { useI18n } from '../i18n/I18nProvider';
import Avatar from './Avatar';
import Icon from './Icon';
import StarRating from './StarRating';

export default function ArtisanCard({ artisan }) {
  const { t, formatNumber, cityName, categoryName } = useI18n();
  const verified = Boolean(artisan.artisan_verified ?? artisan.is_verified);
  const rating = Number(artisan.rating_avg) || 0;
  const hourlyRate = Number(artisan.hourly_rate) || 0;
  const trade = categoryName(artisan);
  const city = cityName(artisan.city);

  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-navy-300 hover:shadow-raised motion-safe:hover:-translate-y-1">
      {/* Trade cover. It stays below the stretched link (no z-index, earlier in the DOM). */}
      <div aria-hidden="true" className="relative h-28 bg-navy-800">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={categoryImage(artisan.category_slug)}
            alt=""
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="img-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
        </div>
        {trade && (
          <span className="absolute bottom-3 start-5 rounded bg-white/95 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-saffron-800">
            {trade}
          </span>
        )}
        <Avatar
          firstName={artisan.first_name}
          lastName={artisan.last_name}
          src={artisanPhoto(artisan)}
          size="xl"
          className="absolute -bottom-8 end-5 shadow-raised ring-4 ring-white"
        />
      </div>

      <div className="flex items-start justify-between gap-4 p-5 pe-24">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-lg font-semibold text-navy-900">
              {/* Stretched link: the whole card is clickable while keeping one focusable element. */}
              <Link to={`/artisans/${artisan.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                <bdi>{artisan.first_name} {artisan.last_name}</bdi>
              </Link>
            </h3>
            {verified && <Icon name="shieldCheck" className="h-4 w-4 shrink-0 text-emerald-600" title={t('card.verifiedTitle')} />}
          </div>
          {city && (
            <p className="mt-1 flex items-center gap-1 text-sm text-sand-600">
              <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0" />
              {city}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 px-5 pb-5">
        <div>
          <p className="text-xs text-sand-600">{t('common.rate')}</p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-navy-900">
            {hourlyRate ? t('common.hourlyRate', { amount: formatNumber(hourlyRate) }) : t('common.onRequest')}
          </p>
        </div>
        <div className="text-end text-sm text-sand-600">
          {rating > 0 ? (
            <StarRating rating={rating} size="xs" showValue count={artisan.rating_count} />
          ) : (
            <span className="font-medium text-navy-700">{t('common.newProfile')}</span>
          )}
          <p className="mt-1">
            {t('common.experience')} : {t('common.years', { count: Number(artisan.years_experience) || 0 })}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-sand-200 bg-sand-50 px-5 py-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${artisan.is_available ? 'text-emerald-700' : 'text-sand-500'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${artisan.is_available ? 'bg-emerald-500' : 'bg-sand-400'}`} />
          {artisan.is_available ? t('common.available') : t('common.unavailable')}
          {artisan.is_premium ? (
            <span className="ms-2 font-semibold uppercase tracking-[0.06em] text-saffron-700">{t('common.premium')}</span>
          ) : null}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 group-hover:text-navy-900 group-hover:underline">
          {t('common.viewProfile')}
          <Icon name="arrowRight" className="h-4 w-4" flipInRtl />
        </span>
      </div>
    </article>
  );
}
