# Artifecta

A creative agency marketing site built with React + Vite + Tailwind CSS, with a small Node.js contact API.

---

## What's inside

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + Tailwind CSS + Framer Motion |
| Contact API | Node.js (no framework, built-in `http` module) |
| Email | Resend |
| Data storage | Local JSON file (`server/data/contact-submissions.json`) |

### Pages & sections

- **Hero** — full-screen intro with animated headline and CTA
- **About** — agency concept, team portraits (`LedByPortraits`)
- **Services** — list of agency offerings
- **Work** — selected projects / portfolio grid
- **Contact** — form that posts to `/api/contact`
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

### 2. Set up the contact API (optional — needed for the contact form)

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in:

```env
RESEND_API_KEY=re_your_key_here          # get one free at resend.com
CONTACT_TO_EMAIL=your-inbox@example.com  # where form submissions land
CONTACT_FROM_EMAIL=Artifecta Contact <onboarding@resend.dev>
```

> If you skip this step the frontend still runs fine — form submissions just won't send emails. They are always saved to `server/data/contact-submissions.json` regardless.

### 3. Start both servers

Open **two terminals**:

**Terminal 1 — Frontend (Vite)**
```bash
npm run dev
```
Runs at → `http://localhost:5173`

**Terminal 2 — Contact API**
```bash
npm run server
```
Runs at → `http://localhost:8787`

Vite automatically proxies `/api/*` requests to the API, so the contact form works out of the box.

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
├── server/
│   ├── index.js              # contact API
│   ├── .env.example
│   └── data/
│       └── contact-submissions.json   # auto-created on first submission
├── m3alemconnect/            # separate sub-project (see its own README)
├── package.json
└── vite.config.js
```

---

## Sub-project: M3alemConnect

`m3alemconnect/` is a separate full-stack Moroccan artisan marketplace. It has its own frontend, backend, and database — completely independent from the Artifecta site.

| Layer | Tech | Port |
|-------|------|------|
| Frontend | React 18 + Vite + Tailwind CSS | 5173 |
| Backend | Node.js + Express | 5000 |
| Database | MySQL | 3306 |

### What you need first — MySQL

The easiest way is **XAMPP**:
1. Download from [apachefriends.org](https://www.apachefriends.org) and install
2. Open the XAMPP Control Panel
3. Click **Start** next to **MySQL**

> If you already have MySQL installed, just make sure it's running.

### 1. Create the database

```bash
cd m3alemconnect/backend
node database/setup.js
```

This creates the `m3alemconnect` database and seeds it with starter data (categories, admin account, sample artisans).

### 2. Configure the backend

```bash
cd m3alemconnect/backend
copy .env.example .env
```

Open `m3alemconnect/backend/.env` and fill in:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # leave blank if using XAMPP (no password by default)
DB_NAME=m3alemconnect

JWT_SECRET=anyrandomstringyouwant123   # make something up, keep it private
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### 3. Start the backend

```bash
cd m3alemconnect/backend
npm install
npm run dev
```

You should see: `Server running on port 5000`

### 4. Start the frontend

Open a **new terminal**:

```bash
cd m3alemconnect/frontend
npm install
npm run dev
```

Open → `http://localhost:5173`

### Demo login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@m3alemconnect.ma | Admin@123 |

> Create your own artisan/client accounts via `/register`

### Terminals summary

| Terminal | Command | Result |
|----------|---------|--------|
| 1 | XAMPP → Start MySQL | Database on port 3306 |
| 2 | `cd m3alemconnect/backend && npm run dev` | API on port 5000 |
| 3 | `cd m3alemconnect/frontend && npm run dev` | App on port 5173 |

---

## Available scripts (Artifecta)

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run server` | Start contact API on port 8787 |
| `npm run build` | Build frontend for production → `dist/` |
| `npm run preview` | Preview the production build locally |
