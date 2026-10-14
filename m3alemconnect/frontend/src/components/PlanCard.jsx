import { useI18n } from '../i18n/I18nProvider';
import { planKey, planName } from '../i18n/helpers';
import Icon from './Icon';

// The recommended plan is drawn on navy, so its action should be a light button (btn-accent / btn-secondary).
export default function PlanCard({ plan, highlighted = false, action }) {
  const { t, tm, formatNumber } = useI18n();
  const key = planKey(plan);
  const description = key ? t(`plans.${key}.description`) : '';
  const features = (key && tm(`plans.${key}.features`)) || plan.features || [];

  return (
    <div
      className={`flex flex-col rounded-lg border p-6 ${
        highlighted ? 'border-navy-900 bg-navy-900 text-white shadow-raised' : 'border-sand-200 bg-white text-navy-900'
      }`}
    >
      {highlighted && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-saffron-300">{t('home.plans.recommended')}</p>
      )}
      <h3 className="text-lg font-semibold">{planName(plan, t)}</h3>
      {description && <p className={`mt-1.5 text-sm ${highlighted ? 'text-navy-200' : 'text-sand-600'}`}>{description}</p>}

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight">{formatNumber(plan.price)}</span>
        <span className={`text-sm ${highlighted ? 'text-navy-200' : 'text-sand-600'}`}>
          {t('quote.currency')} {t('home.plans.perMonth')}
        </span>
      </p>

      <ul className={`mt-6 flex-1 space-y-3 border-t pt-6 ${highlighted ? 'border-white/15' : 'border-sand-200'}`}>
        {features.map((feature) => (
          <li key={feature} className={`flex gap-2.5 text-sm ${highlighted ? 'text-navy-50' : 'text-sand-700'}`}>
            <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${highlighted ? 'text-saffron-400' : 'text-navy-400'}`} strokeWidth={2.25} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
