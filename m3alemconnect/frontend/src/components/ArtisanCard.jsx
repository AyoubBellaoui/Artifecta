import { Link } from 'react-router-dom';
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
    <article className="card group relative flex flex-col overflow-hidden transition-colors duration-200 hover:border-navy-300">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          {trade && <p className="text-xs font-semibold uppercase tracking-[0.06em] text-saffron-700">{trade}</p>}
          <div className="mt-1.5 flex items-center gap-1.5">
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
        <Avatar firstName={artisan.first_name} lastName={artisan.last_name} src={artisan.avatar_url} />
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
