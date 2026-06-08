import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Bienvenue, ${user.first_name} !`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'artisan') navigate('/dashboard/artisan');
      else navigate('/dashboard/client');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-cream px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-saffron font-display font-bold text-2xl">M</span>
            </div>
            <h1 className="font-display font-bold text-navy text-2xl">Connexion</h1>
            <p className="text-gray-500 text-sm mt-1">Content de vous revoir sur M3alemConnect</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Adresse email</label>
              <input
                {...register('email', { required: 'Email requis', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' } })}
                type="email"
                placeholder="votre@email.com"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <input
                {...register('password', { required: 'Mot de passe requis' })}
                type="password"
                placeholder="••••••••"
                className={`input-field ${errors.password ? 'border-red-400' : ''}`}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-saffron font-semibold hover:text-saffron-700">S'inscrire</Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-cream rounded-xl text-xs text-gray-500">
            <strong>Admin demo:</strong> admin@m3alemconnect.ma / Admin@123
          </div>
        </div>
      </motion.div>
    </div>
  );
}
