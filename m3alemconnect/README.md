# M3alemConnect 🇲🇦

> **الحرفي المناسب... وقت ما تحتاج**
> La marketplace marocaine de confiance pour les artisans et travailleurs qualifiés.

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express |
| Base de données | MySQL |
| Auth | JWT + bcrypt |
| Uploads | Multer |

## Démarrage rapide

### 1. Prérequis
- Node.js ≥ 18
- MySQL (XAMPP, WAMP, ou standalone)

### 2. Base de données

```bash
# Créer la base et insérer les données
mysql -u root -p < backend/database/schema.sql
# OU
cd backend && node database/setup.js
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # Configurer DB_PASSWORD et autres vars
npm run dev            # Lance sur http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev            # Lance sur http://localhost:5173
```

## Identifiants de démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@m3alemconnect.ma | Admin@123 |

> Créez vos propres comptes artisan/client via /register

## Fonctionnalités MVP

### Pour les clients
- [x] Inscription / Connexion
- [x] Recherche par métier et ville
- [x] Filtres avancés (note, disponibilité)
- [x] Consultation des profils artisans
- [x] Système d'avis et notes (1-5★)
- [x] Demandes de devis détaillées
- [x] Tableau de bord client

### Pour les artisans
- [x] Inscription professionnelle
- [x] Profil complet (bio, compétences, tarifs)
- [x] Portfolio photos
- [x] Réception et réponse aux devis
- [x] Gestion de la disponibilité
- [x] Abonnements (Gratuit / Pro / Premium)
- [x] Tableau de bord avec statistiques

### Administration
- [x] Dashboard avec KPIs
- [x] Gestion des utilisateurs
- [x] Vérification des artisans
- [x] Modération des avis
- [x] Suivi des devis

## Palette de couleurs

| Couleur | Hex | Signification |
|---------|-----|--------------|
| Deep Navy | #001A33 | Confiance, stabilité, professionnalisme |
| Moroccan Saffron | #D99000 | Énergie, identité marocaine |
| Off-White | #F2F0E6 | Clarté, accessibilité |
| Deep Emerald | #065F2E | Croissance, prospérité |

## Structure du projet

```
m3alemconnect/
├── backend/
│   ├── config/database.js     # Pool MySQL
│   ├── database/schema.sql    # Schéma + seed data
│   ├── middleware/            # Auth JWT, Multer upload
│   ├── routes/               # auth, artisans, reviews, quotes, subscriptions, admin
│   └── server.js
└── frontend/
    ├── src/
    │   ├── contexts/AuthContext.jsx
    │   ├── pages/             # Home, Login, Register, Artisans, ArtisanProfile, Dashboards
    │   ├── components/        # Navbar, Footer, ArtisanCard, StarRating, QuoteModal
    │   └── services/api.js    # Axios instance
    └── tailwind.config.js
```
