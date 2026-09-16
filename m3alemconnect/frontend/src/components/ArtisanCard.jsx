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
  const subtitle = [categoryName(artisan), cityName(artisan.city)].filter(Boolean).join(' · ');

  return (
    <article className="card group relative flex flex-col p-5 transition-shadow duration-200 hover:shadow-raised">
      <div className="flex items-start gap-3.5">
        <Avatar firstName={artisan.first_name} lastName={artisan.last_name} src={artisan.avatar_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-navy-900">
              {/* Stretched link: the whole card is clickable while keeping one focusable element. */}
              <Link to={`/artisans/${artisan.id}`} className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none">
                <bdi>{artisan.first_name} {artisan.last_name}</bdi>
              </Link>
            </h3>
            {verified && <Icon name="shieldCheck" className="h-4 w-4 text-emerald-600" title={t('card.verifiedTitle')} />}
          </div>
          <p className="mt-0.5 truncate text-sm text-sand-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {rating > 0 ? (
          <StarRating rating={rating} showValue count={artisan.rating_count} />
        ) : (
          <span className="chip-neutral">{t('common.newProfile')}</span>
        )}
        {artisan.is_premium ? <span className="chip-premium">{t('common.premium')}</span> : null}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-sand-200 pt-4">
        <div>
          <dt className="text-xs text-sand-600">{t('common.experience')}</dt>
          <dd className="mt-0.5 text-sm font-medium text-navy-900">{t('common.years', { count: Number(artisan.years_experience) || 0 })}</dd>
        </div>
        <div>
          <dt className="text-xs text-sand-600">{t('common.missions')}</dt>
          <dd className="mt-0.5 text-sm font-medium text-navy-900">{formatNumber(artisan.total_jobs)}</dd>
        </div>
        <div>
          <dt className="text-xs text-sand-600">{t('common.rate')}</dt>
          <dd className="mt-0.5 text-sm font-medium text-navy-900">
            {hourlyRate ? t('common.hourlyRate', { amount: formatNumber(hourlyRate) }) : t('common.onRequest')}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${artisan.is_available ? 'text-emerald-700' : 'text-sand-500'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${artisan.is_available ? 'bg-emerald-500' : 'bg-sand-400'}`} />
          {artisan.is_available ? t('common.available') : t('common.unavailable')}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 transition-colors group-hover:text-navy-900">
          {t('common.viewProfile')}
          <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" flipInRtl />
        </span>
      </div>
    </article>
  );
}
