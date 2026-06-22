# CAHIER DES CHARGES
## Projet : M3alemConnect
### Plateforme digitale de mise en relation — Artisans & Clients au Maroc

---

> **Document rédigé par :** Agence Artifecta
> **Date :** Juin 2025
> **Version :** 1.0
> **Statut :** Document de spécifications — Projet de fin d'études

---

## SOMMAIRE

1. [Présentation générale du projet](#1-présentation-générale-du-projet)
2. [Contexte et problématique](#2-contexte-et-problématique)
3. [Objectifs du projet](#3-objectifs-du-projet)
4. [Étude de l'existant et analyse concurrentielle](#4-étude-de-lexistant-et-analyse-concurrentielle)
5. [Description des acteurs](#5-description-des-acteurs)
6. [Besoins fonctionnels](#6-besoins-fonctionnels)
7. [Besoins non fonctionnels](#7-besoins-non-fonctionnels)
8. [Architecture technique](#8-architecture-technique)
9. [Modélisation de la base de données](#9-modélisation-de-la-base-de-données)
10. [Contraintes du projet](#10-contraintes-du-projet)
11. [Planning prévisionnel](#11-planning-prévisionnel)
12. [Conclusion](#12-conclusion)
13. [Glossaire](#13-glossaire)

---

## 1. PRÉSENTATION GÉNÉRALE DU PROJET

### 1.1 Présentation de l'agence Artifecta

Artifecta est une agence digitale fondée dans le cadre d'un projet de fin d'études. Elle regroupe trois membres aux compétences complémentaires, unis autour d'un objectif commun : concevoir et développer des produits numériques innovants répondant à des besoins réels du marché marocain.

| Membre | Rôle | Responsabilités |
|--------|------|-----------------|
| **Ayoub Bellaoui** | Chef de projet / Développeur Backend | Architecture serveur, base de données, API REST, coordination générale |
| **Alae** | Designer UI/UX / Développeur Frontend | Conception des interfaces, expérience utilisateur, développement React |
| **Abdlwadoud** | Chargé marketing / Support technique | Stratégie de contenu, positionnement, étude de marché |

### 1.2 Présentation du projet M3alemConnect

**M3alemConnect** est une marketplace digitale marocaine dédiée à la mise en relation entre des clients (particuliers et petites entreprises) et des artisans qualifiés proposant des services à domicile.

| Champ | Détail |
|-------|--------|
| **Nom du projet** | M3alemConnect |
| **Slogan** | *الحرفي المناسب... وقت ما تحتاج* — "Le bon artisan, quand vous en avez besoin" |
| **Type** | Application web full-stack (marketplace de services) |
| **Périmètre géographique initial** | Casablanca, avec extension progressive aux grandes villes du Maroc |
| **Langues** | Français (principal), Arabe (éléments de branding) |
| **Nature** | Projet de fin d'études — agence Artifecta |

### 1.3 Charte graphique

La plateforme s'appuie sur une identité visuelle premium, moderne et profondément marocaine.

| Couleur | Code Hexadécimal | Signification |
|---------|-----------------|---------------|
| Deep Navy | `#001A33` | Confiance, stabilité, professionnalisme |
| Moroccan Saffron | `#D99000` | Énergie, ambition, identité culturelle marocaine |
| Off-White | `#F2F0E6` | Clarté, accessibilité, modernité |
| Deep Emerald | `#065F2E` | Croissance, prospérité, fiabilité |

---

## 2. CONTEXTE ET PROBLÉMATIQUE

### 2.1 Contexte général

Le Maroc dispose d'un tissu important de travailleurs qualifiés dans les métiers manuels — plombiers, électriciens, menuisiers, peintres, maçons — dont l'activité repose encore largement sur l'économie informelle. Selon les estimations du secteur, plus de **70 % des transactions** entre clients et artisans s'effectuent via le bouche-à-oreille, les groupes Facebook ou des contacts personnels, sans aucun cadre structuré.

Dans ce contexte, la digitalisation progressive du Maroc et l'essor de l'usage mobile créent une opportunité réelle pour une plateforme dédiée à ces métiers.

### 2.2 Problèmes identifiés

#### Du côté des clients :
- Difficulté à trouver un artisan **disponible et fiable** rapidement
- Absence de **transparence sur les tarifs** avant la prestation
- Aucun mécanisme de **vérification des compétences** des prestataires
- Risque élevé de **mauvaise qualité** ou d'arnaque
- Processus de **mise en contact informel** et peu sécurisé
- Impossibilité de **comparer** plusieurs artisans facilement

#### Du côté des artisans :
- **Faible visibilité digitale** : peu ou pas de présence en ligne
- Dépendance totale au bouche-à-oreille pour obtenir des clients
- Absence d'un outil pour **valoriser leur travail** (portfolio, avis)
- Difficulté à **développer leur activité** au-delà de leur réseau proche
- Aucune plateforme spécifiquement **conçue pour leurs métiers**

### 2.3 Problématique centrale

> **Comment créer une plateforme digitale fiable et accessible qui permet aux clients marocains de trouver rapidement un artisan qualifié, tout en offrant aux professionnels du secteur un outil pour développer leur activité et gagner en visibilité ?**

---

## 3. OBJECTIFS DU PROJET

### 3.1 Objectif général

Développer une plateforme web full-stack de mise en relation entre clients et artisans qualifiés au Maroc, en commençant par Casablanca, permettant aux deux parties d'interagir de manière transparente, sécurisée et efficace.

### 3.2 Objectifs spécifiques

#### Pour les clients :
- Permettre la **recherche d'artisans** par catégorie de métier et par ville
- Offrir un accès aux **profils détaillés** des artisans (bio, portfolio, compétences, tarifs)
- Mettre à disposition un système d'**avis et de notation** (1 à 5 étoiles) certifié
- Proposer un mécanisme de **demande de devis** direct et gratuit
- Garantir une expérience utilisateur **simple et intuitive**

#### Pour les artisans :
- Fournir un espace de **création de profil professionnel** complet
- Permettre la mise en ligne d'un **portfolio photo** de réalisations
- Offrir un **tableau de bord** pour gérer les demandes reçues et y répondre
- Proposer des **plans d'abonnement** pour augmenter la visibilité
- Permettre de **gérer sa disponibilité** en temps réel

#### Pour l'administration :
- Disposer d'un **panneau d'administration** pour superviser la plateforme
- Pouvoir **vérifier et valider** les profils artisans
- Modérer les **avis clients** publiés
- Suivre les **statistiques** globales de la plateforme

### 3.3 Objectifs pédagogiques (dans le cadre du projet de fin d'études)

- Démontrer la maîtrise d'une architecture **full-stack** complète (frontend + backend + base de données)
- Appliquer les bonnes pratiques de **développement web** (REST API, authentification JWT, responsive design)
- Produire un **livrable fonctionnel** répondant à un besoin réel identifié
- Mettre en pratique les compétences de **gestion de projet** et de travail en équipe

---

## 4. ÉTUDE DE L'EXISTANT ET ANALYSE CONCURRENTIELLE

### 4.1 Solutions actuellement utilisées au Maroc

Bien qu'il n'existe pas de plateforme marocaine entièrement dédiée à la mise en relation avec des artisans, plusieurs alternatives informelles sont utilisées.

| Solution | Type | Utilisation dans ce contexte | Limites |
|----------|------|------------------------------|---------|
| **Facebook** (groupes) | Réseau social généraliste | Groupes "artisans Casablanca", recherche de prestataires | Aucune vérification, pas de notation, informel, noyé dans les publications |
| **Instagram** | Réseau social visuel | Certains artisans présentent leur travail en photos | Pas de système de devis, aucun filtrage, pas d'évaluation |
| **Avito.ma** | Site d'annonces classifiées | Des artisans publient des offres de services | Non spécialisé, aucune vérification, pas de profil professionnel structuré |
| **Bouche-à-oreille** | Recommandations personnelles | Méthode dominante au Maroc | Non scalable, limité au réseau personnel, aucune transparence |

### 4.2 Analyse comparative

| Critère | Facebook | Avito | Bouche-à-oreille | **M3alemConnect** |
|---------|----------|-------|-----------------|-------------------|
| Profils vérifiés | ✗ | ✗ | ✗ | **✓** |
| Système de notation | ✗ | Partiel | ✗ | **✓** (1-5 étoiles) |
| Portfolio photos | Partiel | ✗ | ✗ | **✓** |
| Demande de devis | ✗ | ✗ | ✗ | **✓** |
| Filtrage par ville | ✗ | ✓ | ✗ | **✓** |
| Filtrage par métier | ✗ | Partiel | ✗ | **✓** |
| Tableau de bord artisan | ✗ | ✗ | ✗ | **✓** |
| Conçu pour le marché marocain | ✗ | Partiel | ✓ | **✓** |
| Disponibilité en temps réel | ✗ | ✗ | ✗ | **✓** |

### 4.3 Avantage concurrentiel de M3alemConnect

M3alemConnect se distingue par sa **spécialisation exclusive** dans les métiers manuels marocains, son système de **confiance structurée** (vérification, notation, avis certifiés) et son adaptation culturelle et linguistique au marché local.

---

## 5. DESCRIPTION DES ACTEURS

La plateforme M3alemConnect repose sur trois types d'acteurs principaux.

### 5.1 Le Client

**Profil :** Particulier marocain ou petite entreprise cherchant un prestataire pour des travaux à domicile ou des réparations.

**Caractéristiques :**
- Particuliers (18–60 ans), propriétaires ou locataires
- Petites entreprises ayant besoin de prestataires occasionnels
- Niveau d'aisance digitale variable
- Principalement basés à Casablanca dans la phase initiale

**Besoins :**
- Trouver rapidement un artisan disponible et fiable
- Pouvoir vérifier la qualité du travail avant de contacter
- Contacter et demander un devis sans engagement
- Laisser un avis après la prestation

### 5.2 L'Artisan

**Profil :** Travailleur indépendant ou petite équipe (2–5 personnes) opérant dans les métiers manuels.

**Catégories ciblées :**
1. Plomberie
2. Électricité
3. Menuiserie
4. Peinture
5. Maçonnerie
6. Réparation d'appareils électroménagers
7. Déménagement
8. Nettoyage professionnel

**Besoins :**
- Se créer une vitrine professionnelle en ligne
- Recevoir des demandes de clients qualifiés
- Gérer sa réputation via les avis
- Développer son activité de manière structurée

### 5.3 L'Administrateur

**Profil :** Membre de l'équipe Artifecta responsable de la gestion de la plateforme.

**Besoins :**
- Superviser l'ensemble des utilisateurs
- Vérifier et valider les profils artisans
- Modérer les avis publiés
- Consulter les statistiques globales
- Gérer les abonnements

---

## 6. BESOINS FONCTIONNELS

### 6.1 Module Authentification et Gestion des comptes

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F01 | Inscription client (email, mot de passe, nom, ville, téléphone) | Client | Haute |
| F02 | Inscription artisan (+ catégorie, expérience, tarif, bio) | Artisan | Haute |
| F03 | Connexion par email/mot de passe avec token JWT | Client / Artisan | Haute |
| F04 | Déconnexion sécurisée | Tous | Haute |
| F05 | Modification du profil personnel (nom, ville, téléphone) | Client / Artisan | Moyenne |
| F06 | Upload d'une photo de profil (avatar) | Artisan | Moyenne |

### 6.2 Module Recherche et Découverte

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F07 | Recherche d'artisans par mot-clé (nom, métier) | Client | Haute |
| F08 | Filtrage par catégorie de service | Client | Haute |
| F09 | Filtrage par ville (Casablanca en priorité) | Client | Haute |
| F10 | Filtrage par note minimale (ex : 4★ et plus) | Client | Moyenne |
| F11 | Filtrage par disponibilité | Client | Moyenne |
| F12 | Tri des résultats (mieux notés, plus expérimentés, premium) | Client | Moyenne |
| F13 | Pagination des résultats (12 artisans par page) | Client | Basse |

### 6.3 Module Profil Artisan

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F14 | Affichage du profil public complet | Client | Haute |
| F15 | Bio professionnelle et présentation | Artisan | Haute |
| F16 | Liste des compétences et services | Artisan | Haute |
| F17 | Tarif horaire affiché | Artisan | Moyenne |
| F18 | Années d'expérience affichées | Artisan | Moyenne |
| F19 | Indicateur de disponibilité (Disponible / Occupé) | Artisan | Haute |
| F20 | Upload et affichage de photos de portfolio | Artisan | Haute |
| F21 | Suppression de photos du portfolio | Artisan | Moyenne |
| F22 | Zones géographiques d'intervention | Artisan | Moyenne |
| F23 | Badge "Vérifié" (accordé par l'admin) | Admin | Haute |
| F24 | Badge "Premium" (via abonnement) | Artisan | Haute |
| F25 | Compteur de vues du profil | Artisan | Basse |

### 6.4 Module Avis et Notation

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F26 | Laisser une note de 1 à 5 étoiles | Client | Haute |
| F27 | Rédiger un commentaire associé à la note | Client | Haute |
| F28 | Limitation : un seul avis par client par artisan | Système | Haute |
| F29 | Calcul et affichage de la note moyenne | Système | Haute |
| F30 | Affichage de la liste des avis sur le profil | Client | Haute |
| F31 | Suppression d'un avis (admin ou auteur) | Admin / Client | Moyenne |
| F32 | Modération des avis par l'administrateur | Admin | Moyenne |

### 6.5 Module Demande de Devis

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F33 | Envoi d'une demande de devis à un artisan | Client | Haute |
| F34 | Champs : description, ville, budget min/max | Client | Haute |
| F35 | Réception et consultation des devis reçus | Artisan | Haute |
| F36 | Réponse de l'artisan (texte + prix proposé) | Artisan | Haute |
| F37 | Refus d'un devis par l'artisan | Artisan | Haute |
| F38 | Historique des devis envoyés (côté client) | Client | Haute |
| F39 | Marquage d'une mission comme "terminée" | Client | Moyenne |
| F40 | Mise à jour automatique du compteur de missions | Système | Moyenne |
| F41 | Statuts de suivi : En attente / Lu / Répondu / Terminé | Système | Haute |

### 6.6 Module Abonnements

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F42 | Affichage des plans disponibles (Gratuit / Pro / Premium) | Artisan | Haute |
| F43 | Souscription à un plan d'abonnement | Artisan | Haute |
| F44 | Activation du badge Premium après souscription | Système | Haute |
| F45 | Mise en avant des artisans Premium dans les résultats | Système | Haute |
| F46 | Affichage du plan actif et de la date d'expiration | Artisan | Moyenne |

**Plans d'abonnement proposés :**

| Plan | Tarif | Durée | Avantages principaux |
|------|-------|-------|---------------------|
| Gratuit | 0 MAD | 30 jours | Profil de base, visible dans la recherche, 5 devis/mois |
| Pro | ~199 MAD | 30 jours | Profil mis en avant, badge vérifié Pro, devis illimités, statistiques |
| Premium | ~399 MAD | 30 jours | Position sponsorisée, badge Premium, statistiques avancées, support dédié |

*Note : Les tarifs sont provisoires et pourront être ajustés.*

### 6.7 Module Administration

| ID | Fonctionnalité | Acteur | Priorité |
|----|---------------|--------|----------|
| F47 | Tableau de bord avec KPIs (utilisateurs, artisans, devis, avis) | Admin | Haute |
| F48 | Liste complète des utilisateurs avec filtres | Admin | Haute |
| F49 | Activation / désactivation d'un compte | Admin | Haute |
| F50 | Vérification et badge d'un artisan | Admin | Haute |
| F51 | Consultation et suppression des avis | Admin | Moyenne |
| F52 | Suivi des demandes de devis | Admin | Moyenne |

---

## 7. BESOINS NON FONCTIONNELS

### 7.1 Performance
- Les pages doivent se charger en **moins de 3 secondes** sur une connexion standard
- L'API doit répondre en **moins de 500 ms** pour les requêtes courantes
- La recherche d'artisans doit retourner des résultats en **temps réel** lors de la saisie

### 7.2 Sécurité
- Authentification par **tokens JWT** (JSON Web Token) avec expiration configurable
- **Hachage des mots de passe** avec bcrypt (coût 12)
- **Validation des données** côté serveur sur tous les endpoints (express-validator)
- Protection contre les injections **SQL** via requêtes paramétrées (mysql2)
- Gestion des **droits d'accès** par rôle (client / artisan / admin)
- Limitation des types de fichiers uploadés (images uniquement : JPG, PNG, WebP)
- Limitation de la taille des fichiers uploadés (**max 5 Mo**)

### 7.3 Ergonomie et Accessibilité
- Interface **responsive** : compatible mobile, tablette et desktop
- Design **intuitif** ne nécessitant pas de formation préalable
- Navigation claire avec un maximum de **3 clics** pour atteindre n'importe quelle fonctionnalité clé
- Messages d'erreur clairs et formulaires avec validation en temps réel
- Support des **navigateurs modernes** : Chrome, Firefox, Edge, Safari

### 7.4 Disponibilité
- La plateforme doit être disponible **24h/24, 7j/7** (dans la phase de production)
- Dans le cadre du projet scolaire : disponible en local sur machine de démonstration

### 7.5 Maintenabilité
- Code source **commenté et documenté**
- Architecture **modulaire** facilitant l'ajout de nouvelles fonctionnalités
- Séparation claire entre **frontend, backend et base de données**
- Utilisation de **variables d'environnement** pour toutes les configurations sensibles

### 7.6 Scalabilité
- La base de données est conçue pour supporter une montée en charge progressive
- Architecture API REST stateless permettant une **scalabilité horizontale** future
- Pagination systématique des listes pour limiter la charge serveur

---

## 8. ARCHITECTURE TECHNIQUE

### 8.1 Stack technologique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | React.js 18 | Bibliothèque UI moderne, composants réutilisables, écosystème riche |
| **Build tool** | Vite | Démarrage instantané, HMR rapide, optimisation production |
| **Styles** | Tailwind CSS | Utilitaire CSS, responsive natif, design system cohérent |
| **Animations** | Framer Motion | Animations fluides et professionnelles |
| **Backend** | Node.js + Express | JavaScript full-stack, léger, adapté aux APIs REST |
| **Base de données** | MySQL | Relationnel, robuste, adapté aux données structurées |
| **Authentification** | JWT + bcrypt | Standard industrie, stateless, sécurisé |
| **Upload fichiers** | Multer | Gestion des fichiers multipart, validation intégrée |
| **Validation** | express-validator | Validation et sanitisation des entrées serveur |

### 8.2 Architecture globale du système

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                            │
│              React App (localhost:5174)                      │
│    Pages : Home | Artisans | Profil | Dashboard | Admin      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / Axios (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVEUR NODE.JS                           │
│              Express API (localhost:5000)                    │
│                                                              │
│  /api/auth          /api/artisans      /api/reviews          │
│  /api/categories    /api/quotes        /api/subscriptions    │
│  /api/admin         /uploads (static)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ mysql2 (SQL queries)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES                           │
│                MySQL (localhost:3306)                        │
│                   m3alemconnect                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Architecture Frontend (React)

```
src/
├── pages/           ← Pages principales (Home, Login, Register, ...)
├── components/      ← Composants réutilisables (Navbar, Footer, Cards...)
├── contexts/        ← Gestion d'état global (AuthContext)
├── services/        ← Couche API (Axios instance + intercepteurs)
├── data/            ← Données de démonstration (mockData.js)
└── index.css        ← Styles globaux + Tailwind
```

### 8.4 Architecture Backend (Node.js/Express)

```
backend/
├── server.js            ← Point d'entrée, configuration Express
├── config/
│   └── database.js      ← Pool de connexions MySQL
├── middleware/
│   ├── auth.js          ← Vérification JWT
│   └── upload.js        ← Configuration Multer
├── routes/
│   ├── auth.js          ← Inscription, connexion, profil
│   ├── artisans.js      ← Recherche, profils, photos
│   ├── categories.js    ← Catégories de services
│   ├── reviews.js       ← Avis et notation
│   ├── quotes.js        ← Demandes de devis
│   ├── subscriptions.js ← Plans et abonnements
│   └── admin.js         ← Panneau d'administration
├── database/
│   └── schema.sql       ← Schéma complet + données initiales
└── uploads/             ← Fichiers uploadés (avatars, portfolio)
```

---

## 9. MODÉLISATION DE LA BASE DE DONNÉES

### 9.1 Tables principales

| Table | Description | Clé primaire |
|-------|-------------|-------------|
| `users` | Tous les comptes (clients, artisans, admin) | `id` |
| `categories` | Les 8 catégories de métiers | `id` |
| `artisan_profiles` | Profil professionnel d'un artisan | `id` |
| `artisan_skills` | Compétences d'un artisan | `id` |
| `portfolio_photos` | Photos de réalisations | `id` |
| `reviews` | Avis et notes des clients | `id` |
| `quote_requests` | Demandes de devis | `id` |
| `subscription_plans` | Plans d'abonnement disponibles | `id` |
| `artisan_subscriptions` | Abonnements souscrits | `id` |

### 9.2 Relations entre les tables

```
users (1) ────────────── (1) artisan_profiles
                                    │
              ┌─────────────────────┼──────────────────────┐
              ▼                     ▼                      ▼
        artisan_skills      portfolio_photos      artisan_subscriptions
                                                           │
                                                           ▼
                                                  subscription_plans

users (client) ──── (N) quote_requests ──── (1) artisan_profiles
users (client) ──── (N) reviews        ──── (1) artisan_profiles
```

### 9.3 Table `users` — Structure principale

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT PK AUTO | Identifiant unique |
| `email` | VARCHAR(255) UNIQUE | Adresse email (identifiant de connexion) |
| `password_hash` | VARCHAR(255) | Mot de passe hashé (bcrypt) |
| `role` | ENUM | `client` / `artisan` / `admin` |
| `first_name` | VARCHAR(100) | Prénom |
| `last_name` | VARCHAR(100) | Nom de famille |
| `phone` | VARCHAR(20) | Numéro de téléphone |
| `city` | VARCHAR(100) | Ville |
| `avatar_url` | VARCHAR(500) | Chemin vers la photo de profil |
| `is_verified` | BOOLEAN | Compte vérifié par l'admin |
| `is_active` | BOOLEAN | Compte actif ou suspendu |
| `created_at` | TIMESTAMP | Date de création |

---

## 10. CONTRAINTES DU PROJET

### 10.1 Contraintes techniques
- La plateforme doit fonctionner **en local** pour la démonstration scolaire (pas d'hébergement externe requis)
- Compatibilité avec **XAMPP / WAMP** pour la base de données MySQL
- Pas de dépendance à des services externes payants
- Les images uploadées sont stockées **localement** sur le serveur

### 10.2 Contraintes humaines et temporelles
- Équipe de **3 personnes** aux disponibilités limitées (charges scolaires parallèles)
- Pas de **budget alloué** pour l'hébergement, les outils ou le marketing
- Projet réalisé dans le cadre d'une **année scolaire**

### 10.3 Contraintes fonctionnelles (périmètre MVP)
- Le paiement en ligne **n'est pas inclus** dans cette version (simulation uniquement)
- Les notifications (email, SMS) ne sont pas implémentées dans le MVP
- La messagerie en temps réel (chat) est reportée à une version ultérieure
- La géolocalisation GPS est hors périmètre pour cette version

---

## 11. PLANNING PRÉVISIONNEL

### 11.1 Phases du projet

| Phase | Contenu | Durée estimée |
|-------|---------|---------------|
| **Phase 1** — Analyse & Conception | Étude de marché, maquettes wireframes, modélisation BDD, rédaction du CDC | 2 semaines |
| **Phase 2** — Mise en place | Configuration environnement, structure projet, base de données, design system | 1 semaine |
| **Phase 3** — Développement Backend | API REST complète (auth, artisans, avis, devis, abonnements, admin) | 3 semaines |
| **Phase 4** — Développement Frontend | Pages et composants React, intégration API, responsive design | 3 semaines |
| **Phase 5** — Tests & Corrections | Tests fonctionnels, correction des bugs, optimisation UI | 1 semaine |
| **Phase 6** — Finalisation | Documentation, CDC final, préparation de la présentation jury | 1 semaine |
| **Total** | | **~11 semaines** |

### 11.2 Répartition des tâches par membre

| Tâche | Ayoub (Backend) | Alae (Frontend/UI) | Abdlwadoud (Marketing/Support) |
|-------|----------------|-------------------|-------------------------------|
| Maquettes & design | Support | ✅ Principal | Support |
| Base de données | ✅ Principal | — | — |
| API REST | ✅ Principal | — | Support |
| Pages React | Support | ✅ Principal | — |
| Intégration API | Support | ✅ Principal | — |
| CDC & documentation | ✅ Principal | Support | ✅ Co-rédacteur |
| Tests fonctionnels | ✅ | ✅ | ✅ |
| Présentation jury | ✅ | ✅ | ✅ |

### 11.3 Jalons clés

| Jalon | Description |
|-------|-------------|
| **J1** | CDC validé et maquettes approuvées |
| **J2** | Base de données opérationnelle et API d'authentification fonctionnelle |
| **J3** | Backend complet (tous les endpoints testés) |
| **J4** | Frontend intégré avec le backend (version alpha) |
| **J5** | Version finale prête pour démonstration (version beta) |
| **J6** | Présentation devant le jury |

---

## 12. CONCLUSION

M3alemConnect est un projet ambitieux et ancré dans une réalité marocaine concrète. Il répond à un **besoin réel et non satisfait** : la mise en relation structurée, fiable et transparente entre les particuliers et les artisans qualifiés.

En combinant les meilleures pratiques du développement web moderne (React, Node.js, MySQL) avec une identité visuelle forte inspirée de la culture marocaine, M3alemConnect vise à apporter une **réelle valeur ajoutée** à deux catégories d'acteurs économiques souvent laissés pour compte par la digitalisation.

Dans le cadre de ce projet de fin d'études, M3alemConnect constitue également une démonstration technique complète de la capacité de l'équipe Artifecta à concevoir, développer et livrer un **produit numérique professionnel et fonctionnel** de bout en bout.

**Au-delà du projet scolaire**, M3alemConnect représente une opportunité entrepreneuriale réelle, avec un potentiel d'extension à l'ensemble des grandes villes du Maroc et une architecture conçue dès le départ pour la **scalabilité et l'évolution**.

---

## 13. GLOSSAIRE

| Terme | Définition |
|-------|-----------|
| **API REST** | Interface de programmation applicative suivant l'architecture REST, permettant la communication entre le frontend et le backend via HTTP |
| **JWT** | JSON Web Token — standard d'authentification sécurisé sans état (stateless) |
| **MVP** | Minimum Viable Product — version minimale fonctionnelle d'un produit |
| **Marketplace** | Plateforme mettant en relation des offreurs de services et des demandeurs |
| **Full-stack** | Développement couvrant à la fois le frontend (interface) et le backend (serveur + base de données) |
| **Responsive** | Interface s'adaptant automatiquement à tous les formats d'écran (mobile, tablette, desktop) |
| **Bcrypt** | Algorithme de hachage cryptographique utilisé pour sécuriser les mots de passe |
| **CRUD** | Create, Read, Update, Delete — les quatre opérations de base sur les données |
| **UI/UX** | User Interface / User Experience — conception de l'interface et de l'expérience utilisateur |
| **Dashboard** | Tableau de bord donnant une vue synthétique des informations et fonctionnalités |
| **Badge vérifié** | Indicateur visuel attribué par l'administrateur confirmant l'authenticité d'un artisan |
| **Artisan** | Professionnel qualifié dans un métier manuel (plombier, électricien, menuisier, etc.) |

---

*Document rédigé par l'agence Artifecta — Juin 2025*
*M3alemConnect — الحرفي المناسب... وقت ما تحتاج*
