# Artifecta

A creative agency marketing site built with React + Vite + Tailwind CSS. The contact form is sent by
Web3Forms, so there is no backend to run.

---

## What's inside

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + Tailwind CSS + Framer Motion |
| Contact form | Web3Forms (sent from the browser, no server) |

### Pages & sections

- **Hero** — full-screen intro with animated headline and CTA
- **About** — agency concept, team portraits (`LedByPortraits`)
- **Services** — list of agency offerings
- **Work** — selected projects / portfolio grid
- **Contact** — form sent to your inbox through Web3Forms
- **Footer** — links and branding

---

## Prerequisites

- **Node.js ≥ 18** — [nodejs.org](https://nodejs.org)
- npm (comes with Node)

---

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Connect the contact form

1. Go to [web3forms.com](https://web3forms.com), enter the inbox that should receive the messages,
   and copy the access key they e-mail you.
2. Paste it into `src/constants/site.js`:

```js
export const WEB3FORMS_ACCESS_KEY = "your-access-key";
```

The key is meant to be used in the browser, so it can be committed. Nothing needs to be set on
Vercel. Without a key, the site runs normally but the form shows an error when submitted.

### 3. Start the site

```bash
npm run dev
```
Runs at → `http://localhost:5173`

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## Project structure

```
Artifecta/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── constants/
│   │   └── site.js           # site content + Web3Forms key
│   └── components/
│       ├── Navbar.jsx
│       ├── LedByPortraits.jsx
│       └── sections/
│           ├── HeroSection.jsx
│           ├── AboutSection.jsx
│           ├── ServicesSection.jsx
│           ├── WorkSection.jsx
│           ├── ContactSection.jsx
│           └── Footer.jsx
├── m3alemconnect/            # separate sub-project (see its own README)
├── package.json
└── vite.config.js
```

---

## Sub-project: M3alemConnect

`m3alemconnect/` is a separate Moroccan artisan marketplace, bilingual French / Arabic. It runs on Supabase, so there is no local database and no API server to start.

| Layer | Tech | Where |
|-------|------|-------|
| Frontend | React 18 + Vite + Tailwind CSS | `localhost:5174` |
| Database, accounts, photo storage | Supabase (PostgreSQL) | hosted |

### 1. Create the database

In the Supabase dashboard: **SQL Editor → New query**, paste the contents of
`m3alemconnect/supabase/schema.sql` and click **Run**. It creates the tables, the security rules,
the photo storage and the starter data, and it can be run again safely.

### 2. Supabase settings

- **Authentication → Sign In / Providers → Email**: turn **Confirm email** off (the free plan only
  sends a few e-mails per hour).
- **Authentication → URL Configuration**: set *Site URL* to `http://localhost:5174`, and replace it
  with the real domain once the site is hosted.

### 3. Add the project keys

```bash
cd m3alemconnect/frontend
copy .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

Both values come from **Project Settings → Data API / API Keys**. The publishable key is meant to be
public: the database rules protect the data. The `service_role` secret key must never be used here.

### 4. Start the site

```bash
cd m3alemconnect/frontend
npm install
npm run dev
```

Open → `http://localhost:5174`

### Admin account

Sign up on the site, then run in the SQL Editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'your@email.com');
```

> Without Supabase keys, or while no artisan has signed up yet, the site shows demo profiles so it
> stays presentable.
>
> `m3alemconnect/backend/` still contains the old Express + MySQL API. It is no longer used.

---

## Available scripts (Artifecta)

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Build frontend for production → `dist/` |
| `npm run preview` | Preview the production build locally |
