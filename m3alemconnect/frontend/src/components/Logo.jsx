import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

export default function Logo({ tone = 'dark' }) {
  const { t } = useI18n();
  const onDark = tone === 'light';

  return (
    <Link to="/" aria-label={t('nav.home')} className="inline-flex shrink-0 items-center gap-2.5 rounded-md">
      <span className={`flex h-9 w-9 items-center justify-center rounded-md ${onDark ? 'bg-white' : ''}`}>
        <img src="/brand/mark.png" alt="" className={onDark ? 'h-7 w-auto' : 'h-9 w-auto'} />
      </span>
      <span dir="ltr" className={`font-sans text-[17px] font-semibold tracking-tight ${onDark ? 'text-white' : 'text-navy-900'}`}>
        M3alem<span className={onDark ? 'text-saffron-300' : 'text-saffron-600'}>Connect</span>
      </span>
    </Link>
  );
}
