import { useI18n } from '../i18n/I18nProvider';
import Icon from './Icon';

export function SectionHeading({ eyebrow, title, subtitle, action, tone = 'default', className = '' }) {
  const onDark = tone === 'dark';
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className={onDark ? 'eyebrow text-saffron-300' : 'eyebrow'}>{eyebrow}</p>}
        <h2 className={`heading-section mt-3 ${onDark ? 'text-white' : ''}`}>{title}</h2>
        {subtitle && <p className={`mt-3 text-base leading-relaxed ${onDark ? 'text-navy-200' : 'text-sand-600'}`}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions, children }) {
  return (
    <div className="border-b border-sand-200 bg-white">
      <div className="container-page py-8 sm:py-10">
        {children}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sand-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function Spinner({ className = 'h-6 w-6' }) {
  const { t } = useI18n();
  return (
    <span
      role="status"
      aria-label={t('common.loading')}
      className={`inline-block animate-spin rounded-full border-2 border-sand-300 border-t-navy ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-sand-600">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      {title && <h3 className="mt-4 text-base font-semibold text-navy-900">{title}</h3>}
      {text && <p className="mt-1.5 max-w-sm text-sm text-sand-600">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ children, icon = 'info', className = '' }) {
  return (
    <div className={`flex items-start gap-3 rounded-md border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy-800 ${className}`}>
      <Icon name={icon} className="mt-0.5 h-4 w-4 text-navy-500" />
      <div>{children}</div>
    </div>
  );
}

export function StatCard({ label, value, icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-sand-600">{label}</p>
        {icon && <Icon name={icon} className="h-5 w-5 text-sand-400" />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-navy-900">{value}</p>
    </div>
  );
}

const STATUS_STYLES = {
  pending: 'chip bg-saffron-50 text-saffron-800',
  viewed: 'chip-info',
  responded: 'chip-verified',
  accepted: 'chip-verified',
  rejected: 'chip-danger',
  completed: 'chip-neutral',
};

export function StatusBadge({ status, audience = 'client' }) {
  const { t } = useI18n();
  const key = STATUS_STYLES[status] ? status : 'pending';
  return <span className={STATUS_STYLES[key]}>{t(`${audience === 'artisan' ? 'inboxStatus' : 'status'}.${key}`)}</span>;
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="card p-5">
          <div className="flex items-center gap-3">
            <div className="skeleton h-9 w-9" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-1/3" />
              <div className="skeleton h-3 w-1/4" />
            </div>
          </div>
          <div className="skeleton mt-5 h-3 w-full" />
          <div className="skeleton mt-2 h-3 w-2/3" />
        </li>
      ))}
    </ul>
  );
}

export function Tabs({ tabs, value, onChange, label, bordered = true }) {
  return (
    <div role="tablist" aria-label={label} className={`flex gap-6 overflow-x-auto ${bordered ? 'border-b border-sand-200' : ''}`}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center whitespace-nowrap pb-3 pt-1 text-sm font-medium transition-colors ${
              active ? 'text-navy-900' : 'text-sand-600 hover:text-navy-900'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ms-2 rounded bg-sand-100 px-1.5 py-0.5 text-xs font-medium text-sand-700">{tab.count}</span>
            )}
            <span className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full ${active ? 'bg-navy' : 'bg-transparent'}`} />
          </button>
        );
      })}
    </div>
  );
}
