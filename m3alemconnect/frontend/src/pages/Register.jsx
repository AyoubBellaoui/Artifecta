import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Agadir','Tanger','Meknès','Oujda','Tétouan','Salé','Kenitra','El Jadida'];

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') === 'artisan' ? 'artisan' : 'client');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role } });

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)).catch(() => {}); }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, role };
      const user = await authRegister(payload);
      toast.success(`Bienvenue sur M3alemConnect, ${user.first_name} !`);
      if (role === 'artisan') navigate('/dashboard/artisan');
      else navigate('/dashboard/client');
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Erreur lors de l\'inscription';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-cream py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-saffron font-display font-bold text-2xl">M</span>
            </div>
            <h1 className="font-display font-bold text-navy text-2xl">Créer un compte</h1>
            <p className="text-gray-500 text-sm mt-1">Rejoignez M3alemConnect gratuitement</p>
          </div>

          {/* Role toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-cream rounded-xl">
            {['client','artisan'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === r ? 'bg-navy text-white shadow-md' : 'text-gray-500 hover:text-navy'}`}>
                {r === 'client' ? '👤 Client' : '🔧 Artisan'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Prénom *</label>
                <input {...register('first_name', { required: 'Requis' })} placeholder="Mohamed" className={`input-field ${errors.first_name ? 'border-red-400' : ''}`} />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="label">Nom *</label>
                <input {...register('last_name', { required: 'Requis' })} placeholder="Alaoui" className={`input-field ${errors.last_name ? 'border-red-400' : ''}`} />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Adresse email *</label>
              <input {...register('email', { required: 'Email requis', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' } })} type="email" placeholder="votre@email.com" className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Mot de passe *</label>
              <input {...register('password', { required: 'Requis', minLength: { value: 8, message: 'Minimum 8 caractères' } })} type="password" placeholder="Minimum 8 caractères" className={`input-field ${errors.password ? 'border-red-400' : ''}`} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Téléphone</label>
                <input {...register('phone')} placeholder="+212 6XX XXX XXX" className="input-field" />
              </div>
              <div>
                <label className="label">Ville</label>
                <select {...register('city')} className="input-field">
                  <option value="">Sélectionner</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Artisan-specific fields */}
            <AnimatePresence>
              {role === 'artisan' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-navy">Informations professionnelles</p>
                  <div>
                    <label className="label">Catégorie de métier *</label>
                    <select {...register('category_id', { required: role === 'artisan' ? 'Catégorie requise' : false })} className={`input-field ${errors.category_id ? 'border-red-400' : ''}`}>
                      <option value="">Choisir un métier</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name_fr}</option>)}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Années d'expérience</label>
                      <input {...register('years_experience', { min: 0, max: 60 })} type="number" min="0" max="60" placeholder="5" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Tarif horaire (MAD)</label>
                      <input {...register('hourly_rate', { min: 0 })} type="number" min="0" placeholder="150" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Présentation courte</label>
                    <textarea {...register('bio_fr')} rows={3} placeholder="Artisan qualifié avec X ans d'expérience..." className="input-field resize-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création en cours...
                </span>
              ) : `Créer mon compte ${role === 'artisan' ? 'artisan' : 'client'}`}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-gray-500 text-sm">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-saffron font-semibold hover:text-saffron-700">Se connecter</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
