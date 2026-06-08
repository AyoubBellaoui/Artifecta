import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function QuoteModal({ artisan, onClose }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/quotes', { ...data, artisan_user_id: artisan.id });
      toast.success('Demande de devis envoyée !');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-navy text-xl">Demander un devis</h2>
                <p className="text-gray-500 text-sm mt-0.5">à {artisan.first_name} {artisan.last_name}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">✕</button>
            </div>

            {!user ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">Connectez-vous pour envoyer un devis</p>
                <Link to="/login" className="btn-primary">Se connecter</Link>
              </div>
            ) : user.role !== 'client' ? (
              <div className="text-center py-6 text-gray-500">Seuls les clients peuvent envoyer des devis.</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label">Description du travail *</label>
                  <textarea
                    {...register('description', { required: 'Description requise', minLength: { value: 10, message: 'Minimum 10 caractères' } })}
                    rows={4}
                    placeholder="Décrivez votre besoin en détail..."
                    className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="label">Ville</label>
                  <input {...register('city')} placeholder="Casablanca, Rabat..." className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Budget min (MAD)</label>
                    <input {...register('budget_min', { min: 0 })} type="number" placeholder="500" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Budget max (MAD)</label>
                    <input {...register('budget_max', { min: 0 })} type="number" placeholder="2000" className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm">Annuler</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? 'Envoi...' : 'Envoyer le devis'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
