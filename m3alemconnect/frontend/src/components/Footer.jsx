import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import Icon from './Icon';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

const FOOTER_SERVICES = ['plomberie', 'electricite', 'peinture', 'menuiserie', 'nettoyage', 'demenagement'];

export default function Footer() {
  const { t, categoryName } = useI18n();
  const linkClass = 'text-navy-200 transition-colors hover:text-white';

  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">{t('footer.about')}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-navy-200">
            <Icon name="mapPin" className="h-4 w-4" />
            {t('footer.location')}
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold text-white">{t('footer.services')}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_SERVICES.map((slug) => (
              <li key={slug}>
                <Link to={`/artisans?category=${slug}`} className={linkClass}>{categoryName(slug)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white">{t('footer.platform')}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/artisans" className={linkClass}>{t('nav.findArtisan')}</Link></li>
            <li><Link to="/register?role=artisan" className={linkClass}>{t('nav.becomeArtisan')}</Link></li>
            <li><Link to="/login" className={linkClass}>{t('nav.login')}</Link></li>
            <li><Link to="/register" className={linkClass}>{t('nav.register')}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white">{t('footer.language')}</h2>
          <LanguageSwitcher tone="dark" className="mt-4" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <p>{t('footer.concept')}</p>
        </div>
      </div>
    </footer>
  );
}
