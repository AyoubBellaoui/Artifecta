# M3alem Connect 🇲🇦

> **الحرفي المناسب، في الوقت المناسب** — Le bon artisan, au bon moment.
>
> Plateforme marocaine de mise en relation entre particuliers et artisans qualifiés.
> Interface bilingue français / arabe (avec mise en page RTL complète).

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Base de données | Supabase (PostgreSQL) |
| Authentification | Supabase Auth (e-mail + mot de passe) |
| Photos | Supabase Storage |
| Sécurité | Row Level Security + fonctions SQL |

Il n'y a **pas de serveur à lancer** : le site parle directement à Supabase.
Le dossier `backend/` contient l'ancienne API Express + MySQL, conservée pour référence ; elle n'est plus utilisée.

## Démarrage

### 1. Prérequis
- Node.js ≥ 18
- Un projet Supabase (gratuit) — [supabase.com](https://supabase.com)

### 2. Créer la base de données

Dans le tableau de bord Supabase : **SQL Editor → New query**, coller le contenu de
[`supabase/schema.sql`](supabase/schema.sql) puis **Run**.

Le script crée les tables, les règles de sécurité, le stockage des photos et les données de départ
(les 8 métiers et les 3 offres d'abonnement). Il peut être relancé sans risque.

### 3. Réglages du projet Supabase

- **Authentication → Sign In / Providers → Email** : désactiver **Confirm email** (le plan gratuit
  n'envoie que quelques e-mails par heure).
- **Authentication → URL Configuration** : *Site URL* = `http://localhost:5174`
  (à remplacer par le domaine final lors de la mise en ligne).

### 4. Lancer le site

```bash
cd C:\Users\PC\Desktop\Artifecta\m3alemconnect\frontend
cd frontend
cp .env.example .env.local   # puis renseigner l'URL et la clé publique du projet
npm install
npm run dev                  # http://localhost:5174
```

Les deux variables attendues dans `frontend/.env.local` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

> La clé publique est faite pour être visible dans le navigateur : ce sont les règles de sécurité
> de la base qui protègent les données. La clé secrète (`service_role`) ne doit **jamais** être utilisée ici.

### 5. Créer le compte administrateur

Créer un compte client sur le site, puis dans le SQL Editor :

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'votre@email.com');
```

## Mode démonstration

Sans clés Supabase, ou tant qu'aucun artisan n'est inscrit, le site affiche des profils de
démonstration : la page d'accueil, la recherche et les fiches artisans restent présentables
lors d'une présentation, sans base de données.

## Fonctionnalités

### Clients
- Recherche par métier, ville, note minimale et disponibilité
- Fiches artisans : présentation, compétences, photos de chantiers, avis
- Demandes de devis gratuites, puis acceptation et clôture de la mission
- Avis (réservés aux clients ayant réellement demandé un devis à l'artisan)

### Artisans
- Profil professionnel : métier, tarif, zones d'intervention, compétences
- Boîte de réception des demandes, avec réponse chiffrée
- Galerie de réalisations (photos hébergées par Supabase Storage)
- Offres Gratuit / Pro / Premium (sans paiement à ce stade du concept)

### Administration
- Indicateurs de la plateforme
- Gestion des comptes : vérification des artisans, activation / désactivation
- Modération des avis et suivi des demandes de devis

## Sécurité

Les règles vivent dans la base, pas dans le navigateur :

- un compte ne peut pas changer son propre rôle, se vérifier lui-même ni modifier ses notes ;
- les notes et le nombre de missions sont calculés par la base ;
- les numéros de téléphone des clients ne sont visibles que par eux-mêmes, par l'administration
  et par l'artisan qu'ils ont contacté ;
- un artisan ne peut répondre qu'aux demandes qui lui sont adressées ;
- les photos ne peuvent être déposées que dans le dossier de leur propriétaire.

Ces règles sont couvertes par des tests automatisés (voir l'historique du projet).

## Structure

```
m3alemconnect/
├── supabase/
│   └── schema.sql            # tables, sécurité, fonctions, données de départ
├── frontend/
│   ├── src/
│   │   ├── services/         # client Supabase + accès aux données
│   │   ├── i18n/             # dictionnaires français / arabe
│   │   ├── components/
│   │   └── pages/
│   └── .env.example
└── backend/                  # ancienne API Express + MySQL (non utilisée)
```
