import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { canReviewArtisan, createReview, fetchArtisan, recordProfileView } from '../services/data';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { errorMessage } from '../i18n/helpers';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import QuoteModal from '../components/QuoteModal';
import StarRating, { StarInput } from '../components/StarRating';
import { EmptyState, PageLoader } from '../components/ui';
import { getDemoArtisan, isDemoId } from '../data/mockData';

function ProfileSection({ title, count, action, children }) {
  const { formatNumber } = useI18n();
  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-navy-900">
          {title}
          {count !== undefined && <span className="ms-2 text-sm font-normal text-sand-500">({formatNumber(count)})</span>}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ReviewForm({ artisanId, clientId, onCancel, onSuccess }) {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) {
      setError(t('profile.reviewForm.selectRating'));
      return;
    }
    setSubmitting(true);
    try {
      await createReview({ artisanId, clientId, rating, comment: comment.trim() });
      toast.success(t('profile.reviewForm.success'));
      onSuccess();
    } catch (err) {
      toast.error(errorMessage(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-md border border-sand-200 bg-sand-50 p-4">
      <p className="label">{t('profile.reviewForm.rating')}</p>
      <StarInput
        value={rating}
        onChange={(value) => {
          setRating(value);
          setError('');
        }}
        label={t('profile.reviewForm.rating')}
      />
      {error && <p className="field-error" role="alert">{error}</p>}

      <label htmlFor="review-comment" className="label mt-4">
        {t('profile.reviewForm.comment')}
        <span className="ms-1.5 font-normal text-sand-500">({t('common.optional')})</span>
      </label>
      <textarea
        id="review-comment"
        dir="auto"
        rows={3}
        maxLength={1000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('profile.reviewForm.placeholder')}
        className="textarea"
      />

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">{t('common.cancel')}</button>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
          {submitting ? t('profile.reviewForm.submitting') : t('profile.reviewForm.submit')}
        </button>
      </div>
    </form>
  );
}

export default function ArtisanProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, pick, formatDate, formatNumber, formatRating, cityName, categoryName } = useI18n();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const viewedProfile = useRef(null);

  useEffect(() => {
    if (isDemoId(id)) {
      setArtisan(getDemoArtisan(id));
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    fetchArtisan(id)
      .then((data) => { if (!cancelled) setArtisan(data); })
      .catch(() => { if (!cancelled) setArtisan(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    if (isDemoId(id) || viewedProfile.current === id) return;
    viewedProfile.current = id;
    recordProfileView(id).catch(() => {});
  }, [id]);

  // Only clients who already requested a quote from this artisan may review.
  useEffect(() => {
    if (!user || user.role !== 'client' || isDemoId(id)) {
      setCanReview(false);
      return undefined;
    }
    let cancelled = false;
    canReviewArtisan(id).then((allowed) => { if (!cancelled) setCanReview(Boolean(allowed)); });
    return () => {
      cancelled = true;
    };
  }, [user, id, reloadKey]);

  if (loading) return <PageLoader />;

  if (!artisan) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon="user"
          title={t('profile.notFoundTitle')}
          text={t('profile.notFoundText')}
          action={<Link to="/artisans" className="btn btn-primary">{t('profile.backToList')}</Link>}
        />
      </div>
    );
  }

  const fullName = `${artisan.first_name} ${artisan.last_name}`;
  const rating = Number(artisan.rating_avg) || 0;
  const reviewCount = Number(artisan.rating_count) || 0;
  const hourlyRate = Number(artisan.hourly_rate) || 0;
  const bio = pick(artisan.bio);
  const skills = pick(artisan.skills) || [];
  const areas = artisan.service_areas || [];
  const reviews = artisan.reviews || [];
  const photos = artisan.photos || [];
  const trade = categoryName({ slug: artisan.category_slug, name_fr: artisan.category_name_fr, name_ar: artisan.category_name_ar });

  const summary = [
    [t('profile.rating'), rating > 0 ? formatRating(rating) : '—'],
    [t('profile.reviewsCount'), formatNumber(reviewCount)],
    [t('profile.jobs'), formatNumber(artisan.total_jobs)],
    [t('profile.experience'), t('common.years', { count: Number(artisan.years_experience) || 0 })],
  ];

  return (
    <>
      <div className="border-b border-sand-200 bg-white">
        <div className="container-page py-6 sm:py-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/artisans" className="inline-flex items-center gap-1.5 text-sm font-medium text-sand-600 hover:text-navy-900">
              <Icon name="arrowLeft" className="h-4 w-4" flipInRtl />
              {t('profile.back')}
            </Link>
            {artisan.isDemo && <span className="chip-neutral">{t('profile.demoNotice')}</span>}
          </div>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <Avatar size="lg" firstName={artisan.first_name} lastName={artisan.last_name} src={artisan.avatar_url} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl">{fullName}</h1>
                  {artisan.is_verified && (
                    <span className="chip-verified">
                      <Icon name="shieldCheck" className="h-3.5 w-3.5" />
                      {t('common.verified')}
                    </span>
                  )}
                  {artisan.is_premium ? <span className="chip-premium">{t('common.premium')}</span> : null}
                </div>
                <p className="mt-1.5 text-base text-sand-700">{trade}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sand-600">
                  {rating > 0 ? (
                    <StarRating rating={rating} showValue count={reviewCount} />
                  ) : (
                    <span className="chip-neutral">{t('common.newProfile')}</span>
                  )}
                  {artisan.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="mapPin" className="h-4 w-4" />
                      {cityName(artisan.city)}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1.5 ${artisan.is_available ? 'text-emerald-700' : ''}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${artisan.is_available ? 'bg-emerald-500' : 'bg-sand-400'}`} />
                    {artisan.is_available ? t('common.available') : t('common.unavailable')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <button type="button" onClick={() => setShowQuote(true)} className="btn btn-primary btn-lg">
                <Icon name="file" className="h-4 w-4" />
                {t('profile.requestQuote')}
              </button>
              {artisan.phone && (
                <a href={`tel:${artisan.phone}`} className="btn btn-secondary btn-lg">
                  <Icon name="phone" className="h-4 w-4" />
                  {t('profile.call')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-8">
          {bio && (
            <ProfileSection title={t('profile.about')}>
              <p dir="auto" className="whitespace-pre-line leading-relaxed text-sand-700">{bio}</p>
            </ProfileSection>
          )}

          {skills.length > 0 && (
            <ProfileSection title={t('profile.skills')}>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill} dir="auto" className="rounded-md border border-sand-200 bg-sand-50 px-3 py-1.5 text-sm text-navy-800">{skill}</li>
                ))}
              </ul>
            </ProfileSection>
          )}

          {photos.length > 0 && (
            <ProfileSection title={t('profile.portfolio')}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <figure key={photo.id} className="overflow-hidden rounded-md border border-sand-200 bg-sand-100">
                    <img src={photo.photo_url} alt={photo.caption || ''} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    {photo.caption && <figcaption dir="auto" className="px-3 py-2 text-xs text-sand-600">{photo.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </ProfileSection>
          )}

          <ProfileSection
            title={t('profile.reviews')}
            count={reviewCount}
            action={
              canReview && !showReviewForm ? (
                <button type="button" onClick={() => setShowReviewForm(true)} className="btn btn-secondary btn-sm">
                  {t('profile.leaveReview')}
                </button>
              ) : null
            }
          >
            {showReviewForm && (
              <ReviewForm
                artisanId={artisan.id}
                clientId={user.id}
                onCancel={() => setShowReviewForm(false)}
                onSuccess={() => {
                  setShowReviewForm(false);
                  setReloadKey((key) => key + 1);
                }}
              />
            )}
            {reviews.length === 0 ? (
              <p className="text-sm text-sand-600">{t('profile.noReviews')}</p>
            ) : (
              <ul className="divide-y divide-sand-200">
                {reviews.map((review) => (
                  <li key={review.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar size="sm" firstName={review.first_name} lastName={review.last_name} src={review.avatar_url} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-navy-900"><bdi>{review.first_name} {review.last_name}</bdi></p>
                          <time dateTime={review.created_at} className="text-xs text-sand-500">{formatDate(review.created_at)}</time>
                        </div>
                        <StarRating rating={review.rating} size="xs" className="mt-1" />
                        {review.comment && (
                          <p dir="auto" className="mt-2 text-sm leading-relaxed text-sand-700">{pick(review.comment)}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ProfileSection>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-navy-900">{t('profile.summary')}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-sand-200 bg-sand-200">
              {summary.map(([label, value]) => (
                <div key={label} className="bg-white p-3.5">
                  <dt className="text-xs text-sand-600">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>

            {hourlyRate > 0 && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-sand-50 px-3.5 py-3">
                <span className="text-sm text-sand-600">{t('profile.hourlyRate')}</span>
                <span className="font-semibold text-navy-900">{t('common.hourlyRate', { amount: formatNumber(hourlyRate) })}</span>
              </div>
            )}

            {areas.length > 0 && (
              <div className="mt-5 border-t border-sand-200 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-sand-600">{t('profile.areas')}</h3>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {areas.map((area) => (
                    <li key={area} className="chip-neutral">
                      <Icon name="mapPin" className="h-3 w-3" />
                      {cityName(area)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-5 border-t border-sand-200 pt-4 text-xs text-sand-500">
              {t('profile.memberSince', { date: formatDate(artisan.created_at, { month: 'long', year: 'numeric' }) })}
              {artisan.views_count ? ` · ${t('profile.views', { count: Number(artisan.views_count) })}` : ''}
            </p>
          </div>

          <div className="rounded-lg bg-navy-800 p-6 text-white lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">{t('profile.contactTitle', { name: artisan.first_name })}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-100">{t('profile.contactText')}</p>
            <button type="button" onClick={() => setShowQuote(true)} className="btn btn-accent mt-5 w-full">
              {t('profile.requestQuote')}
            </button>
            {artisan.phone && (
              <a href={`tel:${artisan.phone}`} className="mt-3 flex items-center justify-center gap-2 text-sm text-navy-100 hover:text-white">
                <Icon name="phone" className="h-4 w-4" />
                <bdi>{artisan.phone}</bdi>
              </a>
            )}
          </div>
        </aside>
      </div>

      {showQuote && <QuoteModal artisan={artisan} onClose={() => setShowQuote(false)} />}
    </>
  );
}
