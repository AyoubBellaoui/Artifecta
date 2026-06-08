import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StarRating, { InteractiveStars } from '../components/StarRating';
import QuoteModal from '../components/QuoteModal';

export default function ArtisanProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/artisans/${id}`)
      .then(r => setArtisan(r.data))
      .catch(() => toast.error('Artisan introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!artisan) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">😕</div>
      <h2 className="font-display font-bold text-navy text-xl">Artisan introuvable</h2>
      <Link to="/artisans" className="btn-primary">Retour à la liste</Link>
    </div>
  );

  const initials = `${artisan.first_name?.[0] || ''}${artisan.last_name?.[0] || ''}`;
  const serviceAreas = artisan.service_areas ? artisan.service_areas.split(',').map(s => s.trim()) : [];

  return (
    <div className="pt-16 bg-cream min-h-screen">
      {/* Cover / Header */}
      <div className="gradient-navy relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/artisans" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            ← Retour aux artisans
          </Link>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              {artisan.avatar_url ? (
                <img src={artisan.avatar_url} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-xl border-2 border-saffron/30" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-saffron/20 flex items-center justify-center text-3xl font-display font-bold text-saffron border-2 border-saffron/30">
                  {initials}
                </div>
              )}
              {artisan.is_available && (
                <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-emerald rounded-full border-2 border-white" title="Disponible" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display font-bold text-white text-2xl">{artisan.first_name} {artisan.last_name}</h1>
                {artisan.artisan_verified && <span className="badge-emerald text-xs">✓ Vérifié</span>}
                {artisan.is_premium && <span className="bg-saffron text-white text-xs px-2 py-0.5 rounded-full font-bold">⭐ Premium</span>}
              </div>
              <div className="flex items-center gap-2 text-saffron font-medium text-sm mb-2">
                <span>{artisan.category_icon}</span>
                <span>{artisan.category_name}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-3">
                <span>📍 {artisan.city || 'Maroc'}</span>
                {artisan.years_experience > 0 && <span>🏆 {artisan.years_experience} ans d'exp.</span>}
                {artisan.total_jobs > 0 && <span>✅ {artisan.total_jobs} missions</span>}
                <span>👁 {artisan.views_count} vues</span>
              </div>
              <StarRating rating={artisan.rating_avg} count={artisan.rating_count} size="md" />
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {artisan.hourly_rate && (
                <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                  <div className="text-saffron font-bold text-xl">{artisan.hourly_rate} MAD</div>
                  <div className="text-white/60 text-xs">/heure</div>
                </div>
              )}
              <button onClick={() => setShowQuote(true)} className="btn-primary px-6 py-2.5 text-sm">
                📋 Demander un devis
              </button>
              {artisan.phone && (
                <a href={`tel:${artisan.phone}`} className="flex items-center justify-center gap-2 bg-emerald/80 hover:bg-emerald text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors">
                  📞 Appeler
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {artisan.bio_fr && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-navy text-lg mb-3">À propos</h2>
              <p className="text-gray-600 leading-relaxed">{artisan.bio_fr}</p>
            </div>
          )}

          {/* Skills */}
          {artisan.skills?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-navy text-lg mb-3">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {artisan.skills.map((s, i) => (
                  <span key={i} className="badge-navy py-1.5 px-3 text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {artisan.photos?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-navy text-lg mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artisan.photos.map(photo => (
                  <motion.div key={photo.id} whileHover={{ scale: 1.02 }} className="relative rounded-xl overflow-hidden aspect-square bg-cream">
                    <img src={photo.photo_url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 p-2">
                        <p className="text-white text-xs">{photo.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-navy text-lg">Avis clients ({artisan.rating_count})</h2>
              {user?.role === 'client' && (
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-saffron text-sm font-semibold hover:text-saffron-700">
                  {showReviewForm ? '✕ Annuler' : '+ Laisser un avis'}
                </button>
              )}
            </div>

            {showReviewForm && <ReviewForm artisanId={artisan.id} onSuccess={() => { setShowReviewForm(false); window.location.reload(); }} />}

            {artisan.reviews?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Aucun avis pour le moment. Soyez le premier !</p>
            ) : (
              <div className="space-y-4">
                {artisan.reviews?.map(rev => (
                  <div key={rev.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {rev.first_name?.[0]}{rev.last_name?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-navy text-sm">{rev.first_name} {rev.last_name}</span>
                        <StarRating rating={rev.rating} />
                        <span className="text-gray-400 text-xs">{new Date(rev.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {rev.comment && <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Stats card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-navy mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Note', value: Number(artisan.rating_avg || 0).toFixed(1) + '★', color: 'text-saffron' },
                { label: 'Avis', value: artisan.rating_count, color: 'text-navy' },
                { label: 'Missions', value: artisan.total_jobs, color: 'text-emerald' },
                { label: 'Exp.', value: `${artisan.years_experience || 0}ans`, color: 'text-navy' },
              ].map(s => (
                <div key={s.label} className="bg-cream rounded-xl p-3 text-center">
                  <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Service areas */}
          {serviceAreas.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-navy mb-3">Zones d'intervention</h3>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area, i) => (
                  <span key={i} className="badge-navy py-1 px-2.5 text-xs">📍 {area}</span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="bg-navy rounded-2xl p-5 text-center">
            <p className="text-white/80 text-sm mb-3">Prêt à démarrer votre projet ?</p>
            <button onClick={() => setShowQuote(true)} className="btn-primary w-full text-sm">
              Demander un devis gratuit
            </button>
            {artisan.phone && (
              <a href={`tel:${artisan.phone}`} className="block mt-2 text-white/60 hover:text-white text-sm transition-colors">
                📞 {artisan.phone}
              </a>
            )}
          </div>

          {/* Member since */}
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-xs">Membre depuis</p>
            <p className="text-navy font-semibold text-sm">{new Date(artisan.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {showQuote && <QuoteModal artisan={artisan} onClose={() => setShowQuote(false)} />}
    </div>
  );
}

function ReviewForm({ artisanId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Veuillez sélectionner une note');
    setLoading(true);
    try {
      await api.post(`/reviews/artisan/${artisanId}`, { rating, comment });
      toast.success('Avis publié !');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmit} className="bg-cream rounded-xl p-4 mb-5 space-y-3">
      <div>
        <label className="label text-xs">Votre note</label>
        <InteractiveStars value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="label text-xs">Votre commentaire (optionnel)</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Partagez votre expérience..." className="input-field resize-none text-sm" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary py-2 px-5 text-sm disabled:opacity-70">
        {loading ? 'Publication...' : 'Publier l\'avis'}
      </button>
    </motion.form>
  );
}
