import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="w-9 h-9 bg-saffron rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
      <span className="text-white font-display font-bold text-lg leading-none">M</span>
    </div>
    <div className="flex flex-col leading-none gap-0.5">
      <span className="font-display font-bold text-navy text-[15px] tracking-tight">M3alem</span>
      <span className="text-saffron text-[9px] font-bold tracking-[0.2em] uppercase">Connect</span>
    </div>
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const dashboardLink = user?.role === 'artisan' ? '/dashboard/artisan' : user?.role === 'admin' ? '/admin' : '/dashboard/client';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/artisans" className="px-4 py-2 rounded-lg text-navy/70 hover:text-navy hover:bg-cream font-medium text-sm transition-all">
              🔍 Trouver un artisan
            </Link>
            <Link to="/register?role=artisan" className="px-4 py-2 rounded-lg text-navy/70 hover:text-navy hover:bg-cream font-medium text-sm transition-all">
              🔧 Devenir artisan
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cream transition-all border border-transparent hover:border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center text-xs font-bold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-navy font-semibold text-xs leading-none">{user.first_name}</div>
                    <div className="text-gray-400 text-[10px] mt-0.5 capitalize">{user.role}</div>
                  </div>
                  <span className={`text-gray-400 text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <Link to={dashboardLink} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy hover:bg-cream transition-colors">
                        <span>📊</span> Mon tableau de bord
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                          <span>🚪</span> Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-navy font-semibold text-sm hover:text-saffron transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm shadow-md">
                  S'inscrire gratuitement
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-cream transition-colors">
            <div className="w-5 flex flex-col gap-1">
              <span className={`block h-0.5 bg-navy rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-navy rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-navy rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              <Link to="/artisans" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-navy hover:bg-cream text-sm font-medium transition-colors">
                🔍 Trouver un artisan
              </Link>
              <Link to="/register?role=artisan" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-navy hover:bg-cream text-sm font-medium transition-colors">
                🔧 Devenir artisan
              </Link>
              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <>
                    <Link to={dashboardLink} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-navy hover:bg-cream text-sm font-medium transition-colors">
                      📊 Mon tableau de bord
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium transition-colors w-full">
                      🚪 Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pb-2">
                    <Link to="/login" className="btn-outline flex-1 py-2.5 text-sm">Connexion</Link>
                    <Link to="/register" className="btn-primary flex-1 py-2.5 text-sm">S'inscrire</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
