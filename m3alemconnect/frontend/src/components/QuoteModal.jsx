import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createQuote } from '../services/data';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { errorMessage } from '../i18n/helpers';
import { CITIES } from '../data/mockData';
import Icon from './Icon';
import { Notice } from './ui';

export default function QuoteModal({ artisan, onClose }) {
  const { user } = useAuth();
  const { t, cityName } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const defaultCity = CITIES.includes(artisan.city) ? artisan.city : '';
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { city: defaultCity } });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createQuote({
        artisanId: artisan.id,
        clientId: user.id,
        description: data.description.trim(),
        city: data.city,
        budgetMin: data.budget_min === '' ? null : Number(data.budget_min),
        budgetMax: data.budget_max === '' ? null : Number(data.budget_max),
      });
      toast.success(t('quote.success'));
      onClose();
    } catch (error) {
      toast.error(errorMessage(error, t));
    } finally {
      setSubmitting(false);
    }
  };

  let content;
  if (artisan.isDemo) {
    content = <Notice>{t('quote.demoOnly')}</Notice>;
  } else if (!user) {
    content = (
      <div>
        <p className="text-sm text-sand-700">{t('quote.loginRequired')}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/login" className="btn btn-primary">{t('quote.login')}</Link>
          <Link to="/register" className="btn btn-secondary">{t('quote.register')}</Link>
        </div>
      </div>
    );
  } else if (user.role !== 'client') {
    content = <Notice>{t('quote.clientsOnly')}</Notice>;
  } else {
    content = (
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="quote-description" className="label">{t('quote.description')}</label>
          <textarea
            id="quote-description"
            dir="auto"
            rows={5}
            placeholder={t('quote.descriptionPlaceholder')}
            className={`textarea ${errors.description ? 'input-invalid' : ''}`}
            aria-invalid={Boolean(errors.description)}
            {...register('description', {
              required: t('quote.descriptionRequired'),
              minLength: { value: 10, message: t('quote.descriptionMin') },
            })}
          />
          {errors.description && <p className="field-error">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="quote-city" className="label">{t('quote.city')}</label>
          <select id="quote-city" className="select" {...register('city')}>
            <option value="">—</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{cityName(city)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['budget_min', 'budget_max'].map((field) => (
            <div key={field}>
              <label htmlFor={`quote-${field}`} className="label">
                {t(field === 'budget_min' ? 'quote.budgetMin' : 'quote.budgetMax')}
              </label>
              <div className="relative">
                <input
                  id={`quote-${field}`}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  className="input pe-14"
                  {...register(field, { min: 0 })}
                />
                <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-sand-500">
                  {t('quote.currency')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-sand-600">{t('quote.hint')}</p>

        <div className="flex flex-col-reverse gap-2 border-t border-sand-200 pt-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-secondary">{t('common.cancel')}</button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? t('quote.submitting') : t('quote.submit')}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white shadow-pop focus:outline-none sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-sand-200 px-6 py-4">
          <div>
            <h2 id="quote-title" className="text-lg font-semibold text-navy-900">{t('quote.title')}</h2>
            <p className="mt-0.5 text-sm text-sand-600">{t('quote.to', { name: `${artisan.first_name} ${artisan.last_name}` })}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="btn btn-ghost btn-sm -me-2 px-2">
            <Icon name="close" />
          </button>
        </div>
        <div className="px-6 py-5">{content}</div>
      </div>
    </div>
  );
}
