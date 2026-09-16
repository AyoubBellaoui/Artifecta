import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  deletePortfolioPhoto,
  fetchCategories,
  fetchInbox,
  fetchMyPhotos,
  fetchPlans,
  respondToQuote,
  subscribeToPlan,
  updateArtisanProfile,
  updateMyProfile,
  uploadPortfolioPhoto,
} from '../services/data';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { budgetText, cleanPhone, errorMessage, planKey, planName } from '../i18n/helpers';
import Avatar from '../components/Avatar';
import Field from '../components/Field';
import Icon from '../components/Icon';
import PlanCard from '../components/PlanCard';
import { EmptyState, ListSkeleton, Notice, StatCard, StatusBadge, Tabs } from '../components/ui';
import { CITIES, FALLBACK_CATEGORIES, FALLBACK_PLANS } from '../data/mockData';

const TAB_IDS = ['overview', 'quotes', 'profile', 'photos', 'subscription'];

function InboxQuote({ quote, onReplied, compact = false }) {
  const { t, formatDate, formatNumber, formatPrice, cityName } = useI18n();
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const budget = budgetText(quote, t, formatNumber);
  const canReply = ['pending', 'viewed'].includes(quote.status);
  const location = cityName(quote.city || quote.client_city);

  const send = async (decision) => {
    if (!reply.trim()) {
      toast.error(t('artisanDash.replyRequired'));
      return;
    }
    setSubmitting(true);
    try {
      await respondToQuote(quote.id, { response: reply.trim(), price, decision });
      toast.success(t('artisanDash.replySent'));
      setOpen(false);
      onReplied?.();
    } catch (error) {
      toast.error(errorMessage(error, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm" firstName={quote.client_first_name} lastName={quote.client_last_name} src={quote.client_avatar_url} />
          <div>
            <p className="text-sm font-semibold text-navy-900">
              <bdi>{quote.client_first_name} {quote.client_last_name}</bdi>
            </p>
            <p className="text-xs text-sand-600">
              {[location, t('artisanDash.receivedOn', { date: formatDate(quote.created_at) })].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <StatusBadge status={quote.status} audience="artisan" />
      </div>

      <p dir="auto" className={`mt-4 whitespace-pre-line text-sm leading-relaxed text-sand-700 ${compact ? 'line-clamp-2' : ''}`}>{quote.description}</p>

      {budget && (
        <p className="mt-3 flex flex-wrap items-baseline gap-2 text-sm">
          <span className="text-sand-600">{t('artisanDash.budget')}</span>
          <span className="font-medium text-navy-900">{budget}</span>
        </p>
      )}

      {quote.client_phone && !compact && (
        <a href={`tel:${quote.client_phone}`} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-900">
          <Icon name="phone" className="h-4 w-4" />
          <bdi>{quote.client_phone}</bdi>
        </a>
      )}

      {quote.artisan_response && !compact && (
        <div className="mt-4 rounded-md border-s-2 border-navy-300 bg-sand-50 px-4 py-3">
          <p className="text-xs font-semibold text-sand-700">{t('artisanDash.yourReply')}</p>
          <p dir="auto" className="mt-1 whitespace-pre-line text-sm text-navy-900">{quote.artisan_response}</p>
          {quote.artisan_price && <p className="mt-2 text-sm font-semibold text-navy-900">{formatPrice(quote.artisan_price)}</p>}
        </div>
      )}

      {!compact && canReply && !open && (
        <div className="mt-4 border-t border-sand-200 pt-4">
          <button type="button" onClick={() => setOpen(true)} className="btn btn-primary btn-sm">
            <Icon name="message" className="h-4 w-4" />
            {t('artisanDash.reply')}
          </button>
        </div>
      )}

      {open && (
        <div className="mt-4 space-y-3 border-t border-sand-200 pt-4">
          <label htmlFor={`reply-${quote.id}`} className="label">{t('artisanDash.yourReply')}</label>
          <textarea
            id={`reply-${quote.id}`}
            dir="auto"
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={t('artisanDash.replyPlaceholder')}
            className="textarea"
          />
          <div className="sm:max-w-xs">
            <label htmlFor={`price-${quote.id}`} className="label">{t('artisanDash.price')}</label>
            <input id={`price-${quote.id}`} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => send('responded')} disabled={submitting} className="btn btn-primary btn-sm">
              {t('artisanDash.sendReply')}
            </button>
            <button type="button" onClick={() => send('rejected')} disabled={submitting} className="btn btn-danger btn-sm">
              {t('artisanDash.decline')}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">{t('common.cancel')}</button>
          </div>
        </div>
      )}
    </li>
  );
}

function ProfileEditor({ user, categories, onSaved }) {
  const { t, categoryName, cityName } = useI18n();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      city: user.city || '',
      bio: user.bio || '',
      years_experience: user.years_experience ?? 0,
      hourly_rate: user.hourly_rate ? Number(user.hourly_rate) : '',
      is_available: user.is_available !== false,
      service_areas: (user.service_areas || []).join(', '),
      skills: (user.skills || []).join(', '),
      category_id: String(user.category_id || ''),
    },
  });

  const toList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 20);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateMyProfile(user.id, {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        city: data.city,
        phone: cleanPhone(data.phone),
      });
      await updateArtisanProfile(user.id, {
        bio: data.bio.trim() || null,
        years_experience: Number(data.years_experience) || 0,
        hourly_rate: data.hourly_rate === '' ? null : Number(data.hourly_rate),
        is_available: Boolean(data.is_available),
        service_areas: toList(data.service_areas),
        skills: toList(data.skills),
        category_id: Number(data.category_id) || user.category_id,
      });
      toast.success(t('artisanDash.saved'));
      onSaved?.();
    } catch (error) {
      toast.error(errorMessage(error, t, 'errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-lg font-semibold text-navy-900">{t('artisanDash.profileTitle')}</h2>

      <section className="card p-6">
        <h3 className="text-sm font-semibold text-navy-900">{t('artisanDash.personal')}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field id="profile-first-name" label={t('auth.firstName')}>
            <input id="profile-first-name" className="input" {...register('first_name')} />
          </Field>
          <Field id="profile-last-name" label={t('auth.lastName')}>
            <input id="profile-last-name" className="input" {...register('last_name')} />
          </Field>
          <Field id="profile-phone" label={t('auth.phone')}>
            <input id="profile-phone" type="tel" dir="ltr" className="input rtl:text-right" {...register('phone')} />
          </Field>
          <Field id="profile-city" label={t('auth.city')}>
            <select id="profile-city" className="select" {...register('city')}>
              <option value="">{t('auth.selectCity')}</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{cityName(city)}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="text-sm font-semibold text-navy-900">{t('artisanDash.professional')}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field id="profile-trade" label={t('auth.trade')} className="sm:col-span-2">
            <select id="profile-trade" className="select" {...register('category_id')}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{categoryName(category)}</option>
              ))}
            </select>
          </Field>
          <Field id="profile-bio" label={t('auth.bio')} className="sm:col-span-2">
            <textarea id="profile-bio" dir="auto" rows={4} placeholder={t('auth.bioPlaceholder')} className="textarea" {...register('bio')} />
          </Field>
          <Field id="profile-experience" label={t('auth.experience')}>
            <input id="profile-experience" type="number" min="0" max="60" className="input" {...register('years_experience')} />
          </Field>
          <Field id="profile-rate" label={t('auth.hourlyRate')}>
            <input id="profile-rate" type="number" min="0" className="input" {...register('hourly_rate')} />
          </Field>
          <Field id="profile-skills" label={t('artisanDash.skills')} hint={t('artisanDash.skillsHint')} className="sm:col-span-2">
            <input id="profile-skills" dir="auto" placeholder={t('artisanDash.skillsPlaceholder')} className="input" {...register('skills')} />
          </Field>
          <Field id="profile-areas" label={t('artisanDash.areas')} hint={t('artisanDash.areasHint')} className="sm:col-span-2">
            <input id="profile-areas" dir="auto" placeholder={t('artisanDash.areasPlaceholder')} className="input" {...register('service_areas')} />
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-navy-900 sm:col-span-2">
            <input type="checkbox" className="checkbox" {...register('is_available')} />
            {t('artisanDash.availableLabel')}
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          {saving ? t('artisanDash.saving') : t('artisanDash.save')}
        </button>
      </div>
    </form>
  );
}

export default function ArtisanDashboard() {
  const { user, refreshUser } = useAuth();
  const { t, formatDate, formatNumber, formatRating, categoryName } = useI18n();
  const [tab, setTab] = useState('overview');
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const artisanId = user?.id;

  const loadQuotes = useCallback(() => {
    if (!artisanId) return Promise.resolve();
    return fetchInbox(artisanId)
      .then((rows) => setQuotes(rows || []))
      .catch(() => {})
      .finally(() => setQuotesLoading(false));
  }, [artisanId]);

  useEffect(() => {
    loadQuotes();
    fetchPlans().then((rows) => { if (rows?.length) setPlans(rows); }).catch(() => {});
    fetchCategories().then((rows) => { if (rows?.length) setCategories(rows); }).catch(() => {});
  }, [loadQuotes]);

  useEffect(() => {
    if (!artisanId) return;
    fetchMyPhotos(artisanId).then((rows) => setPhotos(rows || [])).catch(() => {});
  }, [artisanId]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const photo = await uploadPortfolioPhoto(artisanId, file);
      setPhotos((current) => [photo, ...current]);
      toast.success(t('artisanDash.photoAdded'));
    } catch (error) {
      toast.error(errorMessage(error, t, 'errors.uploadFailed'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeletePhoto = async (photo) => {
    try {
      await deletePortfolioPhoto(photo);
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      toast.success(t('artisanDash.photoDeleted'));
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const result = await subscribeToPlan(plan.id);
      await refreshUser();
      if (result?.ends_at) {
        toast.success(t('artisanDash.subscribed', { plan: planName(plan, t), date: formatDate(result.ends_at) }));
      } else {
        toast.success(t('artisanDash.freePlan'));
      }
    } catch (error) {
      toast.error(errorMessage(error, t));
    }
  };

  if (!user) return null;

  const subscription = user.subscription;
  const tabs = TAB_IDS.map((id) => ({
    id,
    label: t(`artisanDash.tabs.${id}`),
    count: id === 'quotes' && quotes.length ? quotes.length : undefined,
  }));

  return (
    <>
      <div className="border-b border-sand-200 bg-white">
        <div className="container-page pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" firstName={user.first_name} lastName={user.last_name} src={user.avatar_url} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-navy-900">
                    <bdi>{user.first_name} {user.last_name}</bdi>
                  </h1>
                  {user.is_verified ? (
                    <span className="chip-verified">
                      <Icon name="shieldCheck" className="h-3.5 w-3.5" />
                      {t('common.verified')}
                    </span>
                  ) : null}
                  {user.is_premium ? <span className="chip-premium">{t('common.premium')}</span> : null}
                </div>
                {(user.category_slug || user.category_name) && (
                  <p className="mt-1 text-sand-600">{categoryName({ slug: user.category_slug, name_fr: user.category_name })}</p>
                )}
              </div>
            </div>
            <Link to={`/artisans/${user.id}`} className="btn btn-secondary">
              <Icon name="eye" className="h-4 w-4" />
              {t('artisanDash.viewPublicProfile')}
            </Link>
          </div>
          <div className="mt-8">
            <Tabs tabs={tabs} value={tab} onChange={setTab} bordered={false} />
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label={t('artisanDash.stats.views')} value={formatNumber(user.views_count)} icon="eye" />
              <StatCard label={t('artisanDash.stats.quotes')} value={formatNumber(quotes.length)} icon="inbox" />
              <StatCard label={t('artisanDash.stats.jobs')} value={formatNumber(user.total_jobs)} icon="check" />
              <StatCard
                label={t('artisanDash.stats.rating')}
                value={Number(user.rating_avg) > 0 ? formatRating(user.rating_avg) : '—'}
                icon="star"
              />
            </div>

            {!user.is_premium && (
              <div className="flex flex-col gap-4 rounded-lg border border-saffron-200 bg-saffron-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-navy-900">{t('artisanDash.upgradeTitle')}</p>
                  <p className="mt-1 text-sm text-sand-700">{t('artisanDash.upgradeText')}</p>
                </div>
                <button type="button" onClick={() => setTab('subscription')} className="btn btn-primary shrink-0">
                  {t('artisanDash.seePlans')}
                </button>
              </div>
            )}

            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-navy-900">{t('artisanDash.latestQuotes')}</h2>
                {quotes.length > 0 && (
                  <button type="button" onClick={() => setTab('quotes')} className="text-sm font-medium text-navy-700 hover:text-navy-900">
                    {t('artisanDash.seeAll')}
                  </button>
                )}
              </div>
              {quotesLoading ? (
                <ListSkeleton />
              ) : quotes.length === 0 ? (
                <EmptyState icon="inbox" text={t('artisanDash.noQuotes')} />
              ) : (
                <ul className="space-y-3">
                  {quotes.slice(0, 3).map((quote) => (
                    <InboxQuote key={quote.id} quote={quote} onReplied={loadQuotes} compact />
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {tab === 'quotes' && (
          <section>
            <h2 className="text-lg font-semibold text-navy-900">{t('artisanDash.quotesTitle')}</h2>
            <div className="mt-4">
              {quotesLoading ? (
                <ListSkeleton />
              ) : quotes.length === 0 ? (
                <EmptyState icon="inbox" text={t('artisanDash.noQuotes')} />
              ) : (
                <ul className="space-y-3">
                  {quotes.map((quote) => (
                    <InboxQuote key={quote.id} quote={quote} onReplied={loadQuotes} />
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {tab === 'profile' && <ProfileEditor user={user} categories={categories} onSaved={refreshUser} />}

        {tab === 'photos' && (
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-navy-900">{t('artisanDash.photosTitle')}</h2>
                <p className="mt-1 text-sm text-sand-600">{t('artisanDash.photosSubtitle')}</p>
              </div>
              <label
                className={`btn btn-primary cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-saffron-500 ${
                  uploading ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <Icon name="plus" className="h-4 w-4" />
                {uploading ? t('artisanDash.uploading') : t('artisanDash.addPhoto')}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="mt-6">
              {photos.length === 0 ? (
                <EmptyState icon="image" text={t('artisanDash.noPhotos')} />
              ) : (
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => (
                    <li key={photo.id} className="group relative overflow-hidden rounded-md border border-sand-200 bg-sand-100">
                      <img src={photo.photo_url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo)}
                        aria-label={t('artisanDash.deletePhoto')}
                        className="btn btn-sm absolute end-2 top-2 border border-sand-200 bg-white/95 px-2 text-red-700 shadow-card hover:bg-red-50 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {tab === 'subscription' && (
          <section>
            <h2 className="text-lg font-semibold text-navy-900">{t('artisanDash.subscriptionTitle')}</h2>
            <div className="mt-4">
              {subscription ? (
                <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-sand-600">{t('artisanDash.currentPlan')}</p>
                    <p className="mt-0.5 text-lg font-semibold text-navy-900">{planName(subscription, t)}</p>
                  </div>
                  <span className="chip-verified">{t('artisanDash.activeUntil', { date: formatDate(subscription.ends_at) })}</span>
                </div>
              ) : (
                <Notice>{t('artisanDash.freePlan')}</Notice>
              )}
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => {
                const highlighted = planKey(plan) === 'pro';
                const isCurrent = subscription ? subscription.plan_id === plan.id : planKey(plan) === 'free';
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    highlighted={highlighted}
                    action={
                      isCurrent ? (
                        <span className="btn btn-secondary w-full cursor-default">
                          <Icon name="check" className="h-4 w-4" />
                          {t('artisanDash.currentBadge')}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSubscribe(plan)}
                          className={`btn w-full ${highlighted ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          {t('artisanDash.choosePlan')}
                        </button>
                      )
                    }
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
