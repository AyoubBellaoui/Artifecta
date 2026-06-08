import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-saffron rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">M</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">M3alem</div>
                <div className="text-saffron text-xs font-semibold tracking-widest">CONNECT</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              La marketplace marocaine de confiance reliant les clients aux artisans qualifiés.
              <span className="block mt-1 text-saffron/80 font-arabic">الحرفي المناسب... وقت ما تحتاج</span>
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Plomberie','Électricité','Menuiserie','Peinture','Maçonnerie','Nettoyage'].map(s => (
                <li key={s}><Link to={`/artisans?category=${s.toLowerCase()}`} className="hover:text-saffron transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/artisans" className="hover:text-saffron transition-colors">Trouver un artisan</Link></li>
              <li><Link to="/register?role=artisan" className="hover:text-saffron transition-colors">Devenir artisan</Link></li>
              <li><Link to="/register" className="hover:text-saffron transition-colors">S'inscrire</Link></li>
              <li><Link to="/login" className="hover:text-saffron transition-colors">Connexion</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© 2025 M3alemConnect. Tous droits réservés.</p>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            Casablanca, Maroc 🇲🇦
          </div>
        </div>
      </div>
    </footer>
  );
}
