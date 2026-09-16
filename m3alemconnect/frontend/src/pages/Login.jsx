import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { InactiveAccountError, MissingProfileError, useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import { errorMessage } from '../i18n/helpers';
import AuthLayout from '../components/AuthLayout';
import Field, { inputClass } from '../components/Field';
import { dashboardPath } from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const account = await login(data.email.trim(), data.password);
      toast.success(t('auth.welcomeBack', { name: account.first_name }));
      navigate(dashboardPath(account.role));
    } catch (error) {
      if (error instanceof InactiveAccountError) toast.error(t('errors.accountDisabled'));
      else if (error instanceof MissingProfileError) toast.error(t('errors.profileMissing'));
      else toast.error(errorMessage(error, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      footer={
        <p>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-medium text-navy-800 underline decoration-sand-300 underline-offset-4 hover:decoration-navy">
            {t('auth.createAccount')}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field id="login-email" label={t('auth.email')} error={errors.email?.message}>
          <input
            id="login-email"
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

        <Field id="login-password" label={t('auth.password')} error={errors.password?.message}>
          <input
            id="login-password"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className={`${inputClass(errors.password)} rtl:text-right`}
            {...register('password', { required: t('auth.passwordRequired') })}
          />
        </Field>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
          {submitting ? t('auth.loggingIn') : t('auth.submitLogin')}
        </button>
      </form>
    </AuthLayout>
  );
}
