import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nProvider';
import Avatar from './Avatar';
import Icon from './Icon';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export function dashboardPath(role) {
  if (role === 'artisan') return '/dashboard/artisan';
  if (role === 'admin') return '/admin';
  return '/dashboard/client';
}

const linkBase = 'rounded-md px-3 py-2 text-sm font-medium transition-colors';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onPointerDown = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-white/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-navy focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        {t('nav.skipToContent')}
      </a>

      <div className="container-page flex h-16 items-center gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/artisans"
            className={({ isActive }) => `${linkBase} ${isActive ? 'text-navy-900' : 'text-sand-700 hover:text-navy-900'}`}
          >
            {t('nav.findArtisan')}
          </NavLink>
          <Link to="/register?role=artisan" className={`${linkBase} text-sand-700 hover:text-navy-900`}>
            {t('nav.becomeArtisan')}
          </Link>
        </nav>

        <div className="ms-auto hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label={t('nav.account')}
                className="flex items-center gap-2.5 rounded-md py-1 pe-2 ps-1 transition-colors hover:bg-sand-100"
              >
                <Avatar size="sm" firstName={user.first_name} lastName={user.last_name} src={user.avatar_url} />
                <span className="text-start leading-tight">
                  <span className="block text-sm font-medium text-navy-900">{user.first_name}</span>
                  <span className="block text-xs text-sand-600">{t(`roles.${user.role}`)}</span>
                </span>
                <Icon name="chevronDown" className={`h-4 w-4 text-sand-500 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div role="menu" className="absolute end-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-sand-200 bg-white py-1 shadow-pop">
                  <div className="border-b border-sand-200 px-4 py-3">
                    <p className="truncate text-sm font-medium text-navy-900">{user.first_name} {user.last_name}</p>
                    <p className="truncate text-xs text-sand-600">{user.email}</p>
                  </div>
                  <Link
                    role="menuitem"
                    to={dashboardPath(user.role)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy-900 hover:bg-sand-100"
                  >
                    <Icon name="grid" className="h-4 w-4 text-sand-600" />
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50"
                  >
                    <Icon name="logout" className="h-4 w-4" flipInRtl />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary">{t('nav.register')}</Link>
            </>
          )}
        </div>

        <div className="ms-auto flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="btn btn-ghost btn-sm px-2"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-sand-200 bg-white md:hidden">
          <nav className="container-page flex flex-col py-3">
            <Link to="/artisans" className="rounded-md px-2 py-3 text-base font-medium text-navy-900 hover:bg-sand-100">
              {t('nav.findArtisan')}
            </Link>
            <Link to="/register?role=artisan" className="rounded-md px-2 py-3 text-base font-medium text-navy-900 hover:bg-sand-100">
              {t('nav.becomeArtisan')}
            </Link>
            <div className="mt-2 border-t border-sand-200 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 pb-4">
                    <Avatar size="sm" firstName={user.first_name} lastName={user.last_name} src={user.avatar_url} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-sand-600">{t(`roles.${user.role}`)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to={dashboardPath(user.role)} className="btn btn-secondary">{t('nav.dashboard')}</Link>
                    <button type="button" onClick={handleLogout} className="btn btn-danger">{t('nav.logout')}</button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="btn btn-secondary">{t('nav.login')}</Link>
                  <Link to="/register" className="btn btn-primary">{t('nav.register')}</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
