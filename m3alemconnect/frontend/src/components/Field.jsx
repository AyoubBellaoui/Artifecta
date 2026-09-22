import { useI18n } from '../i18n/I18nProvider';

export default function Field({ id, label, error, hint, optional = false, className = '', children }) {
  const { t } = useI18n();
  return (
    <div className={`flex h-full flex-col ${className}`}>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ms-1.5 font-normal text-sand-500">({t('common.optional')})</span>}
      </label>
      {/* Pushed to the bottom so side-by-side fields stay aligned when one label wraps to two lines. */}
      <div className="mt-auto">{children}</div>
      {error ? (
        <p className="field-error" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-sand-600">{hint}</p>
      ) : null}
    </div>
  );
}

export function inputClass(error, base = 'input') {
  return error ? `${base} input-invalid` : base;
}
