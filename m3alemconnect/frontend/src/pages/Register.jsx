import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchCategories } from '../services/data';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { cleanPhone, errorMessage } from '../i18n/helpers';
import AuthLayout from '../components/AuthLayout';
import Field, { inputClass } from '../components/Field';
import Icon from '../components/Icon';
import { dashboardPath } from '../components/Navbar';
import { CITIES, FALLBACK_CATEGORIES } from '../data/mockData';

const ROLES = [
  { value: 'client', icon: 'user', label: 'auth.roleClient', hint: 'auth.roleClientHint' },
  { value: 'artisan', icon: 'briefcase', label: 'auth.roleArtisan', hint: 'auth.roleArtisanHint' },
];

export default function Register() {
  const [params] = useSearchParams();
  const { register: createAccount } = useAuth();
  const { t, categoryName, cityName } = useI18n();
  const navigate = useNavigate();
  const [role, setRole] = useState(params.get('role') === 'artisan' ? 'artisan' : 'client');
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    setRole(params.get('role') === 'artisan' ? 'artisan' : 'client');
  }, [params]);

  useEffect(() => {
    fetchCategories().then((rows) => { if (rows?.length) setCategories(rows); }).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // These values are read once by the database when the account is created.
      const metadata = {
        role,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
      };
      const phone = cleanPhone(data.phone);
      if (phone) metadata.phone = phone;
      if (data.city) metadata.city = data.city;
      if (role === 'artisan') {
        metadata.category_id = String(data.category_id);
        if (data.years_experience) metadata.years_experience = String(data.years_experience);
        if (data.hourly_rate) metadata.hourly_rate = String(data.hourly_rate);
        if (data.bio?.trim()) metadata.bio = data.bio.trim();
      }

      const account = await createAccount({ email: data.email.trim(), password: data.password, ...metadata });
      if (!account) {
        toast.success(t('auth.confirmEmail'));
        navigate('/login');
        return;
      }
      toast.success(t('auth.welcome', { name: account.first_name }));
      navigate(dashboardPath(account.role));
    } catch (error) {
      toast.error(errorMessage(error, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <p>
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-medium text-navy-800 underline decoration-sand-300 underline-offset-4 hover:decoration-navy">
            {t('auth.submitLogin')}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <fieldset>
          <legend className="label">{t('auth.accountType')}</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((option) => {
              const active = role === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-saffron-500 ${
                    active ? 'border-navy bg-navy-50 ring-1 ring-navy' : 'border-sand-300 hover:border-sand-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={active}
                    onChange={() => setRole(option.value)}
                    className="sr-only"
                  />
                  <Icon name={option.icon} className={`mt-0.5 h-5 w-5 ${active ? 'text-navy' : 'text-sand-500'}`} />
                  <span>
                    <span className="block text-sm font-semibold text-navy-900">{t(option.label)}</span>
                    <span className="mt-0.5 block text-xs text-sand-600">{t(option.hint)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="reg-first-name" label={t('auth.firstName')} error={errors.first_name?.message}>
            <input
              id="reg-first-name"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.first_name)}
              className={inputClass(errors.first_name)}
              {...register('first_name', { required: t('auth.fieldRequired') })}
            />
          </Field>
          <Field id="reg-last-name" label={t('auth.lastName')} error={errors.last_name?.message}>
            <input
              id="reg-last-name"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.last_name)}
              className={inputClass(errors.last_name)}
              {...register('last_name', { required: t('auth.fieldRequired') })}
            />
          </Field>
        </div>

        <Field id="reg-email" label={t('auth.email')} error={errors.email?.message}>
          <input
            id="reg-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="name@example.ma"
            aria-invalid={Boolean(errors.email)}
            className={`${inputClass(errors.email)} rtl:text-right`}
            {...register('email', {
              required: t('auth.emailRequired'),
              pattern: { value: /^\S+@\S+\.\S+$/, message: t('auth.emailInvalid') },
            })}
          />
        </Field>

        <Field id="reg-password" label={t('auth.password')} error={errors.password?.message} hint={t('auth.passwordHint')}>
          <input
            id="reg-password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            className={`${inputClass(errors.password)} rtl:text-right`}
            {...register('password', {
              required: t('auth.fieldRequired'),
              minLength: { value: 8, message: t('auth.passwordMin') },
            })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="reg-phone" label={t('auth.phone')} optional>
            <input
              id="reg-phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              className="input rtl:text-right"
              {...register('phone')}
            />
          </Field>
          <Field id="reg-city" label={t('auth.city')} optional>
            <select id="reg-city" className="select" {...register('city')}>
              <option value="">{t('auth.selectCity')}</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{cityName(city)}</option>
              ))}
            </select>
          </Field>
        </div>

        {role === 'artisan' && (
          <fieldset className="space-y-4 rounded-lg border border-sand-200 bg-sand-50 p-4 sm:p-5">
            <legend className="px-1 text-sm font-semibold text-navy-900">{t('auth.proSection')}</legend>

            <Field id="reg-trade" label={t('auth.trade')} error={errors.category_id?.message}>
              <select
                id="reg-trade"
                aria-invalid={Boolean(errors.category_id)}
                className={inputClass(errors.category_id, 'select')}
                {...register('category_id', { required: role === 'artisan' ? t('auth.tradeRequired') : false })}
              >
                <option value="">{t('auth.selectTrade')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{categoryName(category)}</option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="reg-experience" label={t('auth.experience')} optional>
                <input id="reg-experience" type="number" min="0" max="60" className="input" {...register('years_experience', { min: 0, max: 60 })} />
              </Field>
              <Field id="reg-rate" label={t('auth.hourlyRate')} optional>
                <input id="reg-rate" type="number" min="0" className="input" {...register('hourly_rate', { min: 0 })} />
              </Field>
            </div>

            <Field id="reg-bio" label={t('auth.bio')} optional>
              <textarea id="reg-bio" dir="auto" rows={3} placeholder={t('auth.bioPlaceholder')} className="textarea" {...register('bio')} />
            </Field>
          </fieldset>
        )}

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
          {submitting ? t('auth.creating') : t('auth.submitRegister')}
        </button>
      </form>
    </AuthLayout>
  );
}
