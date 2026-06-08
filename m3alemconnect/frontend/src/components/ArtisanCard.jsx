import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRating from './StarRating';

const AVATAR_COLORS = ['#3B82F6','#F59E0B','#8B5CF6','#EF4444','#10B981','#06B6D4','#D97706','#6366F1'];

export default function ArtisanCard({ artisan, index = 0 }) {
  const initials = artisan.initials || `${artisan.first_name?.[0] || ''}${artisan.last_name?.[0] || ''}`;
  const avatarColor = artisan.color || AVATAR_COLORS[index % AVATAR_COLORS.length];
  const isDemo = typeof artisan.id === 'string' && artisan.id.startsWith('demo-');
  const profileLink = isDemo ? '/register' : `/artisans/${artisan.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card card-hover group flex flex-col"
    >
      {/* Top section */}
      <div className="relative">
        {/* Background band */}
        <div className="h-20 w-full" style={{ background: `linear-gradient(135deg, ${avatarColor}20, ${avatarColor}08)` }} />

        {/* Avatar */}
        <div className="absolute left-5 -bottom-6">
          {artisan.avatar_url ? (
            <img src={artisan.avatar_url} alt=""
              className="w-16 h-16 rounded-2xl object-cover border-3 border-white shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-2xl border-3 border-white shadow-lg flex items-center justify-center text-white font-display font-bold text-xl"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)` }}>
              {initials}
            </div>
          )}
          {artisan.is_available && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald rounded-full border-2 border-white" title="Disponible" />
          )}
        </div>

        {/* Badges top right */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {artisan.is_premium && (
            <span className="bg-saffron text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">⭐ Premium</span>
          )}
          {artisan.is_verified && (
            <span className="bg-emerald text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">✓ Vérifié</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="pt-9 px-5 pb-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-display font-bold text-navy text-base group-hover:text-saffron transition-colors leading-tight">
            {artisan.first_name} {artisan.last_name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm">{artisan.category_icon}</span>
            <span className="text-gray-500 text-sm font-medium">{artisan.category_name}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={`text-sm ${n <= Math.round(artisan.rating_avg || 0) ? 'text-saffron' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          <span className="text-gray-600 text-xs font-semibold">{Number(artisan.rating_avg || 0).toFixed(1)}</span>
          <span className="text-gray-400 text-xs">({artisan.rating_count || 0})</span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span>📍</span> {artisan.city || 'Maroc'}
          </span>
          {artisan.years_experience > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span>🏆</span> {artisan.years_experience} ans
            </span>
          )}
          {artisan.total_jobs > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span>✅</span> {artisan.total_jobs} missions
            </span>
          )}
        </div>

        {/* Price */}
        {artisan.hourly_rate && (
          <div className="text-saffron font-bold text-sm mb-4">
            À partir de <span className="text-base">{artisan.hourly_rate}</span> MAD/h
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <Link to={profileLink} className="btn-primary w-full py-2.5 text-sm mt-1">
          {isDemo ? 'S\'inscrire pour voir' : 'Voir le profil'}
        </Link>
      </div>
    </motion.div>
  );
}
