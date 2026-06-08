import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const TABS = ['Vue d\'ensemble', 'Utilisateurs', 'Artisans', 'Avis', 'Devis'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 1 || tab === 2) {
      const role = tab === 2 ? 'artisan' : userFilter;
      api.get('/admin/users', { params: { role: role || undefined, search: userSearch || undefined } }).then(r => setUsers(r.data.users)).catch(() => {});
    }
    if (tab === 3) api.get('/admin/reviews').then(r => setReviews(r.data)).catch(() => {});
    if (tab === 4) api.get('/admin/quotes').then(r => setQuotes(r.data)).catch(() => {});
  }, [tab, userFilter, userSearch]);

  const toggleUser = async (id) => {
    await api.put(`/admin/users/${id}/toggle-active`);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
    toast.success('Statut mis à jour');
  };

  const verifyArtisan = async (id) => {
    await api.put(`/admin/users/${id}/verify`);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_verified: true } : u));
    toast.success('Artisan vérifié ✓');
  };

  const deleteReview = async (id) => {
    await api.delete(`/admin/reviews/${id}`);
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success('Avis supprimé');
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = stats ? [
    { label: 'Total utilisateurs', value: stats.users, icon: '👥', color: 'text-navy' },
    { label: 'Artisans', value: stats.artisans, icon: '🔧', color: 'text-emerald' },
    { label: 'Clients', value: stats.clients, icon: '👤', color: 'text-saffron' },
    { label: 'Devis', value: stats.quotes, icon: '📋', color: 'text-navy' },
    { label: 'Avis', value: stats.reviews, icon: '⭐', color: 'text-saffron' },
    { label: 'Premium', value: stats.premium, icon: '👑', color: 'text-emerald' },
  ] : [];

  return (
    <div className="pt-20 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-saffron rounded-2xl flex items-center justify-center text-2xl shadow-lg">⚙️</div>
            <div>
              <h1 className="font-display font-bold text-navy text-2xl">Administration</h1>
              <p className="text-gray-500 text-sm">M3alemConnect — Panneau de gestion</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm mb-6 overflow-x-auto">
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === i ? 'bg-navy text-white shadow' : 'text-gray-500 hover:text-navy'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statCards.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className={`font-display font-bold text-3xl ${s.color}`}>{s.value}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </motion.div>
              ))}
            </div>
            {stats?.recentUsers?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-display font-bold text-navy mb-4">Dernières inscriptions</h3>
                <div className="space-y-3">
                  {stats.recentUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">{u.first_name?.[0]}{u.last_name?.[0]}</div>
                        <div>
                          <div className="font-medium text-navy text-sm">{u.first_name} {u.last_name}</div>
                          <div className="text-gray-400 text-xs">{u.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge text-xs ${u.role === 'artisan' ? 'badge-saffron' : 'badge-navy'}`}>{u.role}</span>
                        <span className="text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users / Artisans table */}
        {(tab === 1 || tab === 2) && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Rechercher..." className="input-field flex-1 max-w-xs text-sm py-2" />
              {tab === 1 && (
                <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="input-field w-auto text-sm py-2">
                  <option value="">Tous les rôles</option>
                  <option value="client">Clients</option>
                  <option value="artisan">Artisans</option>
                </select>
              )}
              <span className="text-gray-500 text-sm">{users.length} résultat(s)</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream">
                    <tr>
                      <th className="text-left px-4 py-3 text-navy font-semibold">Utilisateur</th>
                      <th className="text-left px-4 py-3 text-navy font-semibold">Rôle</th>
                      <th className="text-left px-4 py-3 text-navy font-semibold">Ville</th>
                      <th className="text-left px-4 py-3 text-navy font-semibold">Statut</th>
                      <th className="text-right px-4 py-3 text-navy font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-t border-gray-50 hover:bg-cream/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-navy">{u.first_name} {u.last_name}</div>
                          <div className="text-gray-400 text-xs">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${u.role === 'artisan' ? 'badge-saffron' : 'badge-navy'}`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.city || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald' : 'bg-red-400'}`} />
                            <span className="text-xs text-gray-500">{u.is_active ? 'Actif' : 'Inactif'}</span>
                            {u.is_verified && <span className="badge-emerald text-xs">✓</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.role === 'artisan' && !u.is_verified && (
                              <button onClick={() => verifyArtisan(u.id)} className="text-xs bg-emerald/10 text-emerald px-2.5 py-1 rounded-lg hover:bg-emerald/20 transition-colors font-medium">
                                Vérifier
                              </button>
                            )}
                            <button onClick={() => toggleUser(u.id)} className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${u.is_active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-emerald/10 text-emerald hover:bg-emerald/20'}`}>
                              {u.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-10 text-gray-400">Aucun utilisateur trouvé</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === 3 && (
          <div>
            <h2 className="font-display font-bold text-navy text-xl mb-4">Gestion des avis ({reviews.length})</h2>
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-navy text-sm">{rev.first_name} {rev.last_name}</span>
                      <span className="text-gray-400 text-xs">→</span>
                      <span className="text-gray-600 text-sm">{rev.artisan_first} {rev.artisan_last}</span>
                      <span className="stars text-saffron text-sm">{'★'.repeat(rev.rating)}</span>
                    </div>
                    {rev.comment && <p className="text-gray-500 text-sm">{rev.comment}</p>}
                    <p className="text-gray-400 text-xs mt-1">{new Date(rev.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <button onClick={() => deleteReview(rev.id)} className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium flex-shrink-0">
                    Supprimer
                  </button>
                </div>
              ))}
              {reviews.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-400">Aucun avis</div>}
            </div>
          </div>
        )}

        {/* Quotes overview */}
        {tab === 4 && (
          <div>
            <h2 className="font-display font-bold text-navy text-xl mb-4">Devis récents ({quotes.length})</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream">
                  <tr>
                    <th className="text-left px-4 py-3 text-navy font-semibold">Client</th>
                    <th className="text-left px-4 py-3 text-navy font-semibold">Artisan</th>
                    <th className="text-left px-4 py-3 text-navy font-semibold">Statut</th>
                    <th className="text-left px-4 py-3 text-navy font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map(q => (
                    <tr key={q.id} className="border-t border-gray-50">
                      <td className="px-4 py-3 text-navy font-medium">{q.client_fn} {q.client_ln}</td>
                      <td className="px-4 py-3 text-gray-600">{q.artisan_fn} {q.artisan_ln}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${q.status === 'completed' ? 'badge-emerald' : q.status === 'responded' ? 'bg-blue-100 text-blue-700' : 'badge-saffron'}`}>{q.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(q.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {quotes.length === 0 && <div className="text-center py-10 text-gray-400">Aucun devis</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
