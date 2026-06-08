import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import { MOCK_ARTISANS, MOCK_CATEGORIES } from '../data/mockData';

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Agadir','Tanger','Meknès','Oujda','Tétouan','Salé'];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Mieux notés' },
  { value: 'jobs', label: 'Plus expérimentés' },
  { value: 'premium', label: 'Premium d\'abord' },
  { value: 'newest', label: 'Les plus récents' },
];

export default function Artisans() {
  const [params, setParams] = useSearchParams();
  const [artisans, setArtisans] = useState(MOCK_ARTISANS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const search = params.get('search') || '';
  const city = params.get('city') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'rating';
  const page = parseInt(params.get('page') || '1');
  const available = params.get('available') || '';
  const minRating = params.get('min_rating') || '';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  useEffect(() => {
    api.get('/categories').then(r => { if (r.data?.length) setCategories(r.data); }).catch(() => {});
  }, []);

  const fetchArtisans = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/artisans', {
        params: { search, city, category, sort, page, available: available || undefined, min_rating: minRating || undefined, limit: 12 }
      });
      setArtisans(data.artisans?.length ? data.artisans : MOCK_ARTISANS);
      setTotal(data.total || MOCK_ARTISANS.length);
      setPages(data.pages || 1);
    } catch {
      setArtisans(MOCK_ARTISANS);
      setTotal(MOCK_ARTISANS.length);
    } finally {
      setLoading(false);
    }
  }, [search, city, category, sort, page, available, minRating]);

  useEffect(() => { fetchArtisans(); }, [fetchArtisans]);

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Header bar */}
      <div className="gradient-navy relative overflow-hidden py-12">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display font-bold text-white text-3xl md:text-4xl mb-2">Trouver un artisan</h1>
          <p className="text-white/50 text-sm mb-6">{total} professionnels disponibles sur M3alemConnect</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-xl px-4 gap-2 focus-within:bg-white focus-within:border-saffron transition-all group">
              <span className="text-white/50 group-focus-within:text-gray-400">🔍</span>
              <input
                value={search}
                onChange={e => setParam('search', e.target.value)}
                placeholder="Nom, métier, compétence..."
                className="flex-1 py-3 text-white placeholder:text-white/40 focus:text-navy focus:outline-none bg-transparent text-sm"
              />
            </div>
            <select value={city} onChange={e => setParam('city', e.target.value)}
              className="sm:w-48 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-sm focus:outline-none focus:bg-white focus:text-navy transition-all">
              <option value="" className="text-navy">📍 Toutes les villes</option>
              {CITIES.map(c => <option key={c} value={c} className="text-navy">{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-display font-bold text-navy mb-4">Filtres</h3>

              <div className="mb-5">
                <label className="label">Catégorie</label>
                <div className="space-y-1.5">
                  <button onClick={() => setParam('category', '')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-navy text-white' : 'text-gray-600 hover:bg-cream'}`}>
                    Toutes
                  </button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setParam('category', c.slug)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${category === c.slug ? 'bg-navy text-white' : 'text-gray-600 hover:bg-cream'}`}>
                      <span>{c.icon}</span> {c.name_fr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 border-t border-gray-100 pt-4">
                <label className="label">Note minimum</label>
                <select value={minRating} onChange={e => setParam('min_rating', e.target.value)} className="input-field text-sm py-2">
                  <option value="">Toutes les notes</option>
                  <option value="4">4★ et plus</option>
                  <option value="4.5">4.5★ et plus</option>
                  <option value="5">5★ seulement</option>
                </select>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={available === 'true'} onChange={e => setParam('available', e.target.checked ? 'true' : '')} className="accent-saffron w-4 h-4" />
                  <span className="text-sm text-gray-700">Disponibles seulement</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm">
                {loading ? 'Recherche...' : `${total} artisan${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
              </p>
              <select value={sort} onChange={e => setParam('sort', e.target.value)} className="input-field w-auto text-sm py-2 bg-white">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-20 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-200 -mt-10" />
                        <div className="flex-1 space-y-2 pt-2">
                          <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                          <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full w-2/3" />
                      <div className="h-9 bg-gray-100 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : artisans.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display font-bold text-navy text-xl mb-2">Aucun artisan trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {artisans.map((a, i) => <ArtisanCard key={a.id} artisan={a} index={i} />)}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => { const n = new URLSearchParams(params); n.set('page', p); setParams(n); }} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-cream'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
