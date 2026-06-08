import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Agadir','Tanger','Meknès','Oujda','Tétouan','Salé'];
const STATUS_LABELS = {
  pending: { label: 'Nouveau', color: 'bg-yellow-100 text-yellow-800' },
  viewed: { label: 'Lu', color: 'bg-blue-100 text-blue-800' },
  responded: { label: 'Répondu', color: 'bg-emerald/10 text-emerald-700' },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-600' },
};

const TABS = ['Vue d\'ensemble', 'Devis reçus', 'Mon profil', 'Photos', 'Abonnement'];

export default function ArtisanDashboard() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [myPlan, setMyPlan] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/quotes/inbox').then(r => setQuotes(r.data)).catch(() => {});
    api.get('/subscriptions/plans').then(r => setPlans(r.data)).catch(() => {});
    api.get('/subscriptions/my').then(r => setMyPlan(r.data)).catch(() => {});
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
    if (user?.artisan_profile_id) {
      api.get(`/artisans/${user.id}`).then(r => setPhotos(r.data.photos || [])).catch(() => {});
    }
  }, [user?.artisan_profile_id, user?.id]);

  const stats = [
    { label: 'Vues du profil', value: user?.views_count || 0, icon: '👁' },
    { label: 'Devis reçus', value: quotes.length, icon: '📋' },
    { label: 'Missions terminées', value: user?.total_jobs || 0, icon: '✅' },
    { label: 'Note moyenne', value: `${Number(user?.rating_avg || 0).toFixed(1)}★`, icon: '⭐' },
  ];

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    setUploading(true);
    try {
      const { data } = await api.post('/artisans/photos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPhotos(prev => [data, ...prev]);
      toast.success('Photo ajoutée !');
    } catch {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.delete(`/artisans/photos/${photoId}`);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success('Photo supprimée');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      const { data } = await api.post('/subscriptions/subscribe', { plan_id: planId });
      toast.success(data.message);
      const { data: updated } = await api.get('/subscriptions/my');
      setMyPlan(updated);
      refreshUser();
    } catch {
      toast.error('Erreur lors de la souscription');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center text-xl font-display font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div>
              <h1 className="font-display font-bold text-navy text-2xl">{user?.first_name} {user?.last_name}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
                <span>{user?.category_icon}</span>
                <span>{user?.category_name}</span>
                {user?.is_premium && <span className="badge bg-saffron/10 text-saffron text-xs">⭐ Premium</span>}
                {user?.artisan_verified && <span className="badge-emerald text-xs">✓ Vérifié</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mb-6 bg-white rounded-2xl p-1.5 shadow-sm">
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === i ? 'bg-navy text-white shadow' : 'text-gray-500 hover:text-navy'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-display font-bold text-navy text-2xl">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
            {!user?.is_premium && (
              <div className="bg-saffron/10 border border-saffron/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-navy">Passez à Pro !</h3>
                  <p className="text-gray-600 text-sm mt-0.5">Mettez votre profil en avant et obtenez plus de clients.</p>
                </div>
                <button onClick={() => setTab(4)} className="btn-primary py-2 px-5 text-sm flex-shrink-0">
                  Voir les plans
                </button>
              </div>
            )}
            <div>
              <h2 className="font-display font-bold text-navy text-lg mb-3">Derniers devis reçus</h2>
              {quotes.slice(0, 3).map(q => <QuoteCard key={q.id} quote={q} onRefresh={() => api.get('/quotes/inbox').then(r => setQuotes(r.data))} />)}
              {quotes.length === 0 && <EmptyState icon="📭" msg="Aucun devis reçu pour l'instant." />}
            </div>
          </div>
        )}

        {/* Quotes inbox */}
        {tab === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-navy text-xl">Devis reçus ({quotes.length})</h2>
            {quotes.length === 0 ? <EmptyState icon="📭" msg="Aucun devis reçu pour l'instant." /> :
              quotes.map(q => <QuoteCard key={q.id} quote={q} onRefresh={() => api.get('/quotes/inbox').then(r => setQuotes(r.data))} expanded />)
            }
          </div>
        )}

        {/* Profile editor */}
        {tab === 2 && <ProfileEditor user={user} categories={categories} onSuccess={refreshUser} />}

        {/* Photos */}
        {tab === 3 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-navy text-xl">Portfolio ({photos.length})</h2>
              <label className={`btn-primary py-2 px-5 text-sm cursor-pointer ${uploading ? 'opacity-70' : ''}`}>
                {uploading ? 'Téléchargement...' : '+ Ajouter une photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>
            {photos.length === 0 ? <EmptyState icon="🖼️" msg="Ajoutez des photos de vos réalisations pour attirer plus de clients." /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-cream shadow-sm">
                    <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold shadow">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription */}
        {tab === 4 && (
          <div>
            <h2 className="font-display font-bold text-navy text-xl mb-2">Mon abonnement</h2>
            {myPlan ? (
              <div className="bg-emerald/10 border border-emerald/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-navy">{myPlan.plan_name}</div>
                  <div className="text-gray-500 text-sm">Actif jusqu'au {new Date(myPlan.ends_at).toLocaleDateString('fr-FR')}</div>
                </div>
                <span className="badge-emerald">✓ Actif</span>
              </div>
            ) : (
              <div className="bg-cream rounded-2xl p-4 mb-6 text-sm text-gray-500">Vous utilisez le plan gratuit.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan, i) => (
                <div key={plan.id} className={`bg-white rounded-2xl border-2 p-5 ${i === 1 ? 'border-saffron shadow-lg' : 'border-gray-200'}`}>
                  <h3 className="font-display font-bold text-navy text-lg">{plan.name}</h3>
                  <div className="text-3xl font-bold text-navy my-2">{plan.price === 0 ? 'Gratuit' : `${plan.price} MAD`}</div>
                  <ul className="space-y-2 mb-5">
                    {(plan.features || []).map((f, j) => <li key={j} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-emerald">✓</span>{f}</li>)}
                  </ul>
                  <button onClick={() => handleSubscribe(plan.id)} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${i === 1 ? 'btn-primary' : 'btn-outline'}`}>
                    {plan.price === 0 ? 'Plan actuel' : 'Souscrire'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, msg }) {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-gray-500 text-sm">{msg}</p>
    </div>
  );
}

function QuoteCard({ quote, onRefresh, expanded = false }) {
  const [responding, setResponding] = useState(false);
  const [response, setResponse] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const statusInfo = STATUS_LABELS[quote.status] || STATUS_LABELS.pending;

  const handleRespond = async (status) => {
    if (!response.trim()) return toast.error('Écrivez votre réponse');
    setSubmitting(true);
    try {
      await api.put(`/quotes/${quote.id}/respond`, { artisan_response: response, artisan_price: price || undefined, status });
      toast.success('Réponse envoyée !');
      setResponding(false);
      onRefresh?.();
    } catch {
      toast.error('Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cream text-navy flex items-center justify-center text-sm font-bold">{quote.first_name?.[0]}{quote.last_name?.[0]}</div>
          <div>
            <div className="font-semibold text-navy text-sm">{quote.first_name} {quote.last_name}</div>
            <div className="text-gray-400 text-xs">{quote.client_city || 'Maroc'} · {new Date(quote.created_at).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
        <span className={`badge text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>
      <p className={`text-gray-600 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>{quote.description}</p>
      {(quote.budget_min || quote.budget_max) && (
        <div className="text-saffron text-xs font-medium mt-2">
          Budget: {quote.budget_min && `${quote.budget_min}`}{quote.budget_min && quote.budget_max && ' - '}{quote.budget_max && `${quote.budget_max}`} MAD
        </div>
      )}
      {quote.status === 'viewed' && expanded && !responding && (
        <button onClick={() => setResponding(true)} className="mt-3 btn-primary py-2 px-4 text-xs">Répondre à ce devis</button>
      )}
      {responding && (
        <div className="mt-3 space-y-2">
          <textarea value={response} onChange={e => setResponse(e.target.value)} rows={3} placeholder="Votre réponse..." className="input-field text-sm resize-none" />
          <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="Prix proposé (MAD)" className="input-field text-sm" />
          <div className="flex gap-2">
            <button onClick={() => handleRespond('responded')} disabled={submitting} className="btn-primary py-2 px-4 text-xs disabled:opacity-70">Envoyer la réponse</button>
            <button onClick={() => handleRespond('rejected')} disabled={submitting} className="py-2 px-4 text-xs bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">Refuser</button>
            <button onClick={() => setResponding(false)} className="py-2 px-4 text-xs bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileEditor({ user, categories, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      bio_fr: user?.bio_fr || '',
      years_experience: user?.years_experience || 0,
      hourly_rate: user?.hourly_rate || '',
      is_available: user?.is_available !== false,
      service_areas: user?.service_areas || '',
      category_id: user?.category_id || '',
      skills: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put('/auth/profile', { first_name: data.first_name, last_name: data.last_name, phone: data.phone, city: data.city });
      await api.put('/artisans/profile', {
        bio_fr: data.bio_fr,
        years_experience: data.years_experience,
        hourly_rate: data.hourly_rate || undefined,
        is_available: data.is_available,
        service_areas: data.service_areas,
        category_id: data.category_id || undefined,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      });
      toast.success('Profil mis à jour !');
      onSuccess?.();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="font-display font-bold text-navy text-xl">Modifier mon profil</h2>
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-navy text-sm">Informations personnelles</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label text-xs">Prénom</label><input {...register('first_name')} className="input-field text-sm" /></div>
          <div><label className="label text-xs">Nom</label><input {...register('last_name')} className="input-field text-sm" /></div>
          <div><label className="label text-xs">Téléphone</label><input {...register('phone')} className="input-field text-sm" /></div>
          <div>
            <label className="label text-xs">Ville</label>
            <select {...register('city')} className="input-field text-sm">
              <option value="">Choisir</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-navy text-sm">Profil professionnel</h3>
        <div>
          <label className="label text-xs">Catégorie</label>
          <select {...register('category_id')} className="input-field text-sm">
            <option value="">Garder la catégorie actuelle</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name_fr}</option>)}
          </select>
        </div>
        <div><label className="label text-xs">Présentation</label><textarea {...register('bio_fr')} rows={4} className="input-field text-sm resize-none" placeholder="Décrivez vos compétences et votre expérience..." /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label text-xs">Années d'exp.</label><input {...register('years_experience', { min: 0 })} type="number" className="input-field text-sm" /></div>
          <div><label className="label text-xs">Tarif/h (MAD)</label><input {...register('hourly_rate')} type="number" className="input-field text-sm" /></div>
        </div>
        <div><label className="label text-xs">Compétences (séparées par virgule)</label><input {...register('skills')} className="input-field text-sm" placeholder="Installation, Dépannage, Rénovation..." /></div>
        <div><label className="label text-xs">Zones d'intervention (séparées par virgule)</label><input {...register('service_areas')} className="input-field text-sm" placeholder="Casablanca, Mohammedia, Berrechid..." /></div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('is_available')} className="accent-saffron w-4 h-4" />
          <span className="text-sm text-gray-700">Je suis disponible pour de nouvelles missions</span>
        </label>
      </div>
      <button type="submit" disabled={loading} className="btn-primary py-3 px-8 disabled:opacity-70">
        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  );
}
