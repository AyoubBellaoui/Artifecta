import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

const STATUS_LABELS = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  viewed: { label: 'Vu', color: 'bg-blue-100 text-blue-800' },
  responded: { label: 'Répondu', color: 'bg-emerald/10 text-emerald-700' },
  accepted: { label: 'Accepté', color: 'bg-emerald/20 text-emerald-800' },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-600' },
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    api.get('/quotes/mine')
      .then(r => setQuotes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (quoteId) => {
    try {
      await api.put(`/quotes/${quoteId}/complete`);
      setQuotes(q => q.map(x => x.id === quoteId ? { ...x, status: 'completed' } : x));
    } catch {}
  };

  return (
    <div className="pt-20 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-navy text-2xl md:text-3xl">
            Bonjour, {user?.first_name} 👋
          </h1>
          <p className="text-gray-500 mt-1">Gérez vos demandes de devis</p>
        </motion.div>

        {/* Quick search CTA */}
        <div className="bg-navy rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-white text-lg">Trouver un artisan</h2>
            <p className="text-white/60 text-sm mt-0.5">Parcourez notre réseau de professionnels qualifiés</p>
          </div>
          <Link to="/artisans" className="btn-primary flex-shrink-0 py-2.5 px-6 text-sm">
            Explorer →
          </Link>
        </div>

        {/* Quotes list */}
        <div>
          <h2 className="font-display font-bold text-navy text-xl mb-4">Mes demandes de devis ({quotes.length})</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
            </div>
          ) : quotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="font-display font-bold text-navy text-lg mb-2">Aucune demande pour l'instant</h3>
              <p className="text-gray-500 text-sm mb-5">Trouvez un artisan et envoyez votre première demande de devis.</p>
              <Link to="/artisans" className="btn-primary text-sm">Trouver un artisan</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((q, i) => {
                const statusInfo = STATUS_LABELS[q.status] || STATUS_LABELS.pending;
                return (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {q.first_name?.[0]}{q.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-navy">{q.first_name} {q.last_name}</div>
                          <div className="text-gray-500 text-sm flex items-center gap-1">
                            <span>{q.icon}</span> {q.category_name}
                          </div>
                        </div>
                      </div>
                      <span className={`badge text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{q.description}</p>

                    {q.artisan_response && (
                      <div className="bg-emerald/5 border border-emerald/20 rounded-xl p-3 mb-3">
                        <p className="text-xs font-semibold text-emerald mb-1">Réponse de l'artisan</p>
                        <p className="text-gray-700 text-sm">{q.artisan_response}</p>
                        {q.artisan_price && <p className="text-saffron font-bold text-sm mt-1">Prix proposé: {q.artisan_price} MAD</p>}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">{new Date(q.created_at).toLocaleDateString('fr-FR')}</span>
                      <div className="flex gap-2">
                        <Link to={`/artisans/${q.artisan_profile_id}`} className="text-xs text-saffron hover:text-saffron-700 font-medium">Voir profil</Link>
                        {q.status === 'responded' && (
                          <button onClick={() => handleComplete(q.id)} className="text-xs bg-emerald text-white px-3 py-1 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                            Marquer terminé
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
