/**
 * M3alemConnect — Cahier des Charges Word Generator
 * Agence Artifecta — 2025
 *
 * Run: node generate.js
 * Output: ../M3alemConnect_CDC.docx
 */

'use strict';

const {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType,
  ImageRun, PageBreak,
  Header, Footer, PageNumber,
  HeadingLevel,
} = require('docx');

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

// ─── Brand colours ────────────────────────────────────────────────────────────
const C = {
  NAVY:       '001A33',
  SAFFRON:    'D99000',
  EMERALD:    '065F2E',
  CREAM:      'F2F0E6',
  WHITE:      'FFFFFF',
  LIGHT:      'F8F9FA',
  BODY:       '2C3E50',
  MUTED:      '666666',
};

// ─── Mermaid diagram codes ────────────────────────────────────────────────────
const DIAGRAMS = {

  useCase: `flowchart LR
    Client(["CLIENT"])
    Artisan(["ARTISAN"])
    Admin(["ADMIN"])
    subgraph UC_CLIENT ["Actions du Client"]
        C1["S'inscrire / Se connecter"]
        C2["Rechercher un artisan"]
        C3["Filtrer par ville et metier"]
        C4["Consulter un profil artisan"]
        C5["Laisser un avis"]
        C6["Envoyer une demande de devis"]
        C7["Suivre ses demandes"]
    end
    subgraph UC_ARTISAN ["Actions de l'Artisan"]
        A1["S'inscrire / Se connecter"]
        A2["Creer son profil professionnel"]
        A3["Uploader des photos portfolio"]
        A4["Gerer sa disponibilite"]
        A5["Recevoir des devis"]
        A6["Repondre ou refuser un devis"]
        A7["Souscrire un abonnement"]
    end
    subgraph UC_ADMIN ["Actions de l'Administrateur"]
        AD1["Consulter les KPIs"]
        AD2["Gerer les utilisateurs"]
        AD3["Verifier un artisan"]
        AD4["Moderer les avis"]
    end
    Client --- UC_CLIENT
    Artisan --- UC_ARTISAN
    Admin --- UC_ADMIN`,

  er: `erDiagram
    USERS ||--o| ARTISAN_PROFILES : possede
    USERS ||--o{ REVIEWS : redige
    USERS ||--o{ QUOTE_REQUESTS : envoie
    CATEGORIES ||--o{ ARTISAN_PROFILES : categorise
    ARTISAN_PROFILES ||--o{ PORTFOLIO_PHOTOS : contient
    ARTISAN_PROFILES ||--o{ ARTISAN_SKILLS : possede
    ARTISAN_PROFILES ||--o{ REVIEWS : recoit
    ARTISAN_PROFILES ||--o{ QUOTE_REQUESTS : recoit
    ARTISAN_PROFILES ||--o{ ARTISAN_SUBSCRIPTIONS : souscrit
    SUBSCRIPTION_PLANS ||--o{ ARTISAN_SUBSCRIPTIONS : definit
    USERS { int id varchar email varchar role boolean is_verified }
    CATEGORIES { int id varchar name_fr varchar slug }
    ARTISAN_PROFILES { int id int user_id int category_id decimal rating_avg boolean is_premium }
    REVIEWS { int id int artisan_id int client_id tinyint rating text comment }
    QUOTE_REQUESTS { int id int artisan_id int client_id enum status text description }
    SUBSCRIPTION_PLANS { int id varchar name decimal price int duration_days }
    ARTISAN_SUBSCRIPTIONS { int id int artisan_id int plan_id timestamp ends_at }
    PORTFOLIO_PHOTOS { int id int artisan_id varchar photo_url }
    ARTISAN_SKILLS { int id int artisan_id varchar skill_name }`,

  gantt: `gantt
    title Planning M3alemConnect - Agence Artifecta
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b
    section Phase 1 - Analyse
    Etude de marche et CDC          :done, p1a, 2025-01-06, 7d
    Maquettes et wireframes         :done, p1b, 2025-01-10, 7d
    section Phase 2 - Mise en place
    Configuration environnement     :done, p2a, 2025-01-17, 3d
    Design system et base de donnees:done, p2b, 2025-01-20, 5d
    section Phase 3 - Backend
    Auth et gestion utilisateurs    :done, p3a, 2025-01-27, 6d
    Artisans et categories          :done, p3b, 2025-02-03, 6d
    Avis devis et abonnements       :done, p3c, 2025-02-10, 7d
    API Administration              :done, p3d, 2025-02-17, 4d
    section Phase 4 - Frontend
    Pages publiques                 :active, p4a, 2025-02-21, 7d
    Profil artisan et recherche     :p4b, 2025-02-28, 5d
    Dashboards client et artisan    :p4c, 2025-03-05, 6d
    Dashboard administrateur        :p4d, 2025-03-11, 4d
    section Phase 5 - Tests
    Tests fonctionnels              :p5a, 2025-03-15, 5d
    Corrections et optimisation     :p5b, 2025-03-20, 4d
    section Phase 6 - Finalisation
    Documentation et CDC final      :p6a, 2025-03-24, 3d
    Preparation presentation jury   :p6b, 2025-03-27, 4d
    Presentation devant le jury     :milestone, m1, 2025-04-01, 1d`,

  architecture: `flowchart TB
    subgraph BROWSER ["React App - localhost:5174"]
        UI["Pages React"]
        AUTH["AuthContext JWT"]
        AXIOS["Axios Service"]
    end
    subgraph SERVER ["Node.js Express - localhost:5000"]
        MW["JWT Middleware"]
        R1["/api/auth"]
        R2["/api/artisans"]
        R3["/api/reviews"]
        R4["/api/quotes"]
        R5["/api/admin"]
        MULTER["Multer Upload"]
    end
    subgraph DATABASE ["MySQL - m3alemconnect"]
        T1[("users")]
        T2[("artisan_profiles")]
        T3[("reviews")]
        T4[("quotes")]
    end
    UPL["/uploads/ images"]
    BROWSER -->|HTTP JSON + JWT| MW
    MW --> R1
    MW --> R2
    MW --> R3
    MW --> R4
    MW --> R5
    R1 --> T1
    R2 --> T2
    R3 --> T3
    R4 --> T4
    MULTER --> UPL`,
};

// ─── Fetch Mermaid diagram as PNG via mermaid.ink ─────────────────────────────
function fetchMermaidPng(code) {
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({ code, mermaid: { theme: 'default' } });
      const encoded = Buffer.from(payload).toString('base64');
      const url     = `https://mermaid.ink/img/${encoded}`;

      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { timeout: 15000 }, (res) => {
        if (res.statusCode !== 200) { resolve(null); return; }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', () => resolve(null));
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch { resolve(null); }
  });
}

// ─── Document helpers ─────────────────────────────────────────────────────────

function sectionBanner(numStr, title) {
  return new Paragraph({
    children: [
      new TextRun({ text: numStr + '.  ' + title, bold: true, size: 30, color: C.WHITE, font: 'Calibri' }),
    ],
    shading: { fill: C.NAVY, type: ShadingType.CLEAR, color: 'auto' },
    spacing: { before: 120, after: 320 },
    indent: { left: 200, right: 200 },
  });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, color: C.NAVY, font: 'Calibri' })],
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.SAFFRON, space: 4 } },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: C.EMERALD, font: 'Calibri' })],
    spacing: { before: 200, after: 80 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: opts.size || 20, color: opts.color || C.BODY, font: 'Calibri', italics: opts.italics || false })],
    spacing: { before: 80, after: 80 },
    alignment: opts.align || AlignmentType.LEFT,
  });
}

function bullet(text, lvl = 0) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, color: C.BODY, font: 'Calibri' })],
    bullet: { level: lvl },
    spacing: { before: 60, after: 60 },
    indent: { left: 360 + lvl * 360 },
  });
}

function gap(sz = 160) {
  return new Paragraph({ spacing: { before: sz } });
}

function pgBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function quoteBox(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 21, bold: true, italics: true, color: C.NAVY, font: 'Calibri' })],
    border: {
      left:   { style: BorderStyle.SINGLE, size: 8, color: C.SAFFRON, space: 8 },
      top:    { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
    },
    shading: { fill: 'FFF9E6', type: ShadingType.CLEAR, color: 'auto' },
    spacing: { before: 160, after: 160 },
    indent: { left: 360, right: 360 },
  });
}

// ─── Table helper ──────────────────────────────────────────────────────────────
function mkTable(headers, rows, colWidths, headerBg = C.NAVY) {
  const cols = colWidths || headers.map(() => Math.floor(9000 / headers.length));

  const CELL_BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const ALL_BORDERS = {
    top: CELL_BORDER, bottom: CELL_BORDER,
    left: CELL_BORDER, right: CELL_BORDER,
    insideHorizontal: CELL_BORDER, insideVertical: CELL_BORDER,
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      width: { size: cols[i], type: WidthType.DXA },
      shading: { fill: headerBg, type: ShadingType.CLEAR, color: 'auto' },
      borders: ALL_BORDERS,
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, size: 19, color: C.WHITE, font: 'Calibri' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
      })],
    })),
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      width: { size: cols[ci], type: WidthType.DXA },
      shading: { fill: ri % 2 === 0 ? C.WHITE : C.LIGHT, type: ShadingType.CLEAR, color: 'auto' },
      borders: ALL_BORDERS,
      children: [new Paragraph({
        children: [new TextRun({ text: String(cell), size: 18, color: C.BODY, font: 'Calibri' })],
        spacing: { before: 70, after: 70 },
        indent: { left: 120 },
      })],
    })),
  }));

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });
}

// ─── Image block ──────────────────────────────────────────────────────────────
function imgBlock(buf, caption) {
  const items = [];
  if (buf) {
    items.push(new Paragraph({
      children: [new ImageRun({
        data: buf,
        transformation: { width: 620, height: 360 },
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 100 },
      border: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        left:   { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        right:  { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      },
    }));
  } else {
    items.push(new Paragraph({
      children: [new TextRun({
        text: `[ Diagramme : ${caption} — generez ce schema sur mermaid.live ]`,
        italics: true, color: '999999', size: 18, font: 'Calibri',
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      shading: { fill: 'F5F5F5', type: ShadingType.CLEAR, color: 'auto' },
    }));
  }
  items.push(new Paragraph({
    children: [new TextRun({ text: `Figure : ${caption}`, italics: true, size: 17, color: C.MUTED, font: 'Calibri' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
  }));
  return items;
}

// ─── Cover page helper ────────────────────────────────────────────────────────
function bigText(text, size, color, align = AlignmentType.CENTER, spacing = {}) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size, color, font: 'Calibri' })],
    alignment: align,
    spacing,
  });
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n🎨 M3alemConnect — CDC Generator\n');
  console.log('📡 Fetching Mermaid diagrams from mermaid.ink...');

  const [usecaseImg, erImg, ganttImg, archImg] = await Promise.all([
    fetchMermaidPng(DIAGRAMS.useCase),
    fetchMermaidPng(DIAGRAMS.er),
    fetchMermaidPng(DIAGRAMS.gantt),
    fetchMermaidPng(DIAGRAMS.architecture),
  ]);

  console.log(`   Use Case diagram  : ${usecaseImg ? '✅' : '⚠️  (placeholder)'}`);
  console.log(`   ER diagram        : ${erImg      ? '✅' : '⚠️  (placeholder)'}`);
  console.log(`   Gantt diagram     : ${ganttImg   ? '✅' : '⚠️  (placeholder)'}`);
  console.log(`   Architecture      : ${archImg    ? '✅' : '⚠️  (placeholder)'}`);
  console.log('\n📝 Building document...\n');

  // ── Header & Footer ──────────────────────────────────────────────────────
  const docHeader = new Header({
    children: [new Paragraph({
      children: [
        new TextRun({ text: 'M3alemConnect  ', bold: true, size: 18, color: C.NAVY, font: 'Calibri' }),
        new TextRun({ text: '|  Cahier des Charges  — Agence Artifecta', size: 17, color: C.MUTED, font: 'Calibri' }),
      ],
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: C.SAFFRON, space: 4 } },
      spacing: { after: 0 },
    })],
  });

  const docFooter = new Footer({
    children: [new Paragraph({
      children: [
        new TextRun({ text: "M3alemConnect  ·  Projet de fin d'etudes  ·  Agence Artifecta  ·  Page ", size: 16, color: C.MUTED, font: 'Calibri' }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.NAVY, font: 'Calibri' }),
        new TextRun({ text: ' / ', size: 16, color: C.MUTED, font: 'Calibri' }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: C.NAVY, font: 'Calibri' }),
      ],
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.SAFFRON, space: 4 } },
    })],
  });

  // ── TOC entries ──────────────────────────────────────────────────────────
  const toc = [
    ['1.', "Presentation generale du projet"],
    ['2.', "Contexte et problematique"],
    ['3.', "Objectifs du projet"],
    ['4.', "Etude de l'existant et analyse concurrentielle"],
    ['5.', "Description des acteurs"],
    ['6.', "Besoins fonctionnels"],
    ['7.', "Besoins non fonctionnels"],
    ['8.', "Architecture technique"],
    ['9.', "Modelisation de la base de donnees"],
    ['10.', "Contraintes du projet"],
    ['11.', "Planning previsionnel"],
    ['12.', "Conclusion"],
    ['13.', "Glossaire"],
  ].map(([num, title]) => new Paragraph({
    children: [
      new TextRun({ text: `${num}  ${title}`, size: 20, color: C.NAVY, font: 'Calibri' }),
    ],
    spacing: { before: 120, after: 120 },
    indent: { left: 360 },
  }));

  // ── Assemble document ────────────────────────────────────────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1200, bottom: 1440, left: 1440 },
        },
      },
      headers: { default: docHeader },
      footers: { default: docFooter },
      children: [

        // ══════════════════════ COVER PAGE ══════════════════════════════
        gap(600),
        bigText('M3alem', 88, C.NAVY, AlignmentType.CENTER, { after: 0 }),
        bigText('CONNECT', 88, C.SAFFRON, AlignmentType.CENTER, { after: 400 }),
        para("Al-Harfi Al-Munasib... waqt ma tahtaj", { align: AlignmentType.CENTER, italics: true, color: C.MUTED, size: 22 }),
        gap(240),
        new Paragraph({
          children: [new TextRun({ text: 'CAHIER DES CHARGES', bold: true, size: 44, color: C.WHITE, font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          shading: { fill: C.NAVY, type: ShadingType.CLEAR, color: 'auto' },
          spacing: { before: 160, after: 160 },
          indent: { left: 200, right: 200 },
        }),
        gap(360),
        mkTable(
          ['Champ', 'Detail'],
          [
            ['Nom du projet',    'M3alemConnect'],
            ['Type',             'Application web full-stack — Marketplace de services'],
            ['Agence',           'Artifecta'],
            ['Version',          '1.0'],
            ['Date',             'Juin 2025'],
            ['Statut',           "Projet de fin d'etudes"],
            ['Perimetre',        'Casablanca — Maroc'],
          ],
          [2600, 6400],
        ),
        gap(360),
        h2("Equipe Artifecta"),
        mkTable(
          ['Membre', 'Role', 'Responsabilites'],
          [
            ['Ayoub Bellaoui', "Chef de projet / Backend Dev", "Architecture serveur, BDD, API REST, coordination"],
            ['Alae',           "Designer UI/UX / Frontend Dev", "Maquettes, React, experience utilisateur"],
            ['Abdlwadoud',     "Marketing / Support",          "Etude de marche, positionnement, documentation"],
          ],
          [2400, 2600, 4000],
        ),
        pgBreak(),

        // ══════════════════════ SOMMAIRE ════════════════════════════════
        bigText('SOMMAIRE', 40, C.NAVY, AlignmentType.CENTER, { before: 80, after: 320 }),
        ...toc,
        pgBreak(),

        // ══════════════════════ SECTION 1 ═══════════════════════════════
        sectionBanner('1', 'PRESENTATION GENERALE DU PROJET'),

        h2("1.1  L'agence Artifecta"),
        para("Artifecta est une agence digitale fondee dans le cadre d'un projet de fin d'etudes. Elle regroupe trois membres aux competences complementaires, unis autour d'un objectif commun : concevoir et developper des produits numeriques innovants repondant a des besoins reels du marche marocain."),
        gap(100),
        mkTable(
          ['Membre', 'Role', 'Responsabilites'],
          [
            ['Ayoub Bellaoui', "Chef de projet / Backend Dev", "Architecture, API REST, BDD, coordination"],
            ['Alae',           "Designer UI/UX / Frontend Dev", "Maquettes, composants React, UX"],
            ['Abdlwadoud',     "Charge marketing / Support",   "Etude de marche, contenu, documentation"],
          ],
          [2400, 2600, 4000],
        ),

        gap(200),
        h2("1.2  Presentation du projet M3alemConnect"),
        para("M3alemConnect est une marketplace digitale marocaine dediee a la mise en relation entre des clients (particuliers et petites entreprises) et des artisans qualifies proposant des services a domicile. La plateforme couvre 8 categories de metiers : plomberie, electricite, menuiserie, peinture, maconnerie, reparation d'appareils, demenagement et nettoyage."),
        gap(100),
        mkTable(
          ['Champ', 'Detail'],
          [
            ['Nom du projet', 'M3alemConnect'],
            ['Slogan', 'Al-Harfi Al-Munasib... waqt ma tahtaj'],
            ['Type', 'Application web full-stack (marketplace de services)'],
            ['Perimetre initial', 'Casablanca — extension progressive au Maroc'],
            ['Langues', 'Francais (principal), Arabe (branding)'],
            ['Nature', "Projet de fin d'etudes — Agence Artifecta"],
          ],
          [2800, 6200],
        ),

        gap(200),
        h2("1.3  Charte graphique"),
        mkTable(
          ['Couleur', 'Code Hex', 'Signification'],
          [
            ['Deep Navy',          '#001A33', 'Confiance, stabilite, professionnalisme'],
            ['Moroccan Saffron',   '#D99000', 'Energie, ambition, identite culturelle marocaine'],
            ['Off-White / Cream',  '#F2F0E6', 'Clarte, accessibilite, modernite'],
            ['Deep Emerald',       '#065F2E', 'Croissance, prosperite, fiabilite'],
          ],
          [2200, 1800, 5000],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 2 ═══════════════════════════════
        sectionBanner('2', 'CONTEXTE ET PROBLEMATIQUE'),

        h2("2.1  Contexte general"),
        para("Le Maroc dispose d'un tissu important de travailleurs qualifies dans les metiers manuels dont l'activite repose encore largement sur l'economie informelle. Plus de 70 % des transactions entre clients et artisans s'effectuent via le bouche-a-oreille, les groupes Facebook ou des contacts personnels, sans aucun cadre structure ni garant de qualite."),

        gap(100),
        h2("2.2  Problemes identifies"),

        h3("Du cote des clients :"),
        bullet("Difficulte a trouver un artisan disponible et fiable rapidement"),
        bullet("Absence de transparence sur les tarifs avant la prestation"),
        bullet("Aucun mecanisme de verification des competences des prestataires"),
        bullet("Risque eleve de mauvaise qualite ou d'arnaque"),
        bullet("Impossibilite de comparer plusieurs artisans facilement"),

        gap(80),
        h3("Du cote des artisans :"),
        bullet("Faible visibilite digitale : peu ou pas de presence en ligne"),
        bullet("Dependance totale au bouche-a-oreille pour obtenir des clients"),
        bullet("Absence d'un outil pour valoriser leur travail (portfolio, avis)"),
        bullet("Difficulte a developper leur activite au-dela de leur reseau proche"),
        bullet("Aucune plateforme specifiquement concue pour leurs metiers"),

        gap(200),
        h2("2.3  Problematique centrale"),
        quoteBox("Comment creer une plateforme digitale fiable et accessible qui permet aux clients marocains de trouver rapidement un artisan qualifie, tout en offrant aux professionnels du secteur un outil pour developper leur activite et gagner en visibilite ?"),
        pgBreak(),

        // ══════════════════════ SECTION 3 ═══════════════════════════════
        sectionBanner('3', 'OBJECTIFS DU PROJET'),

        h2("3.1  Objectif general"),
        para("Developper une plateforme web full-stack de mise en relation entre clients et artisans qualifies au Maroc, en commencant par Casablanca, permettant aux deux parties d'interagir de maniere transparente, securisee et efficace."),

        gap(100),
        h2("3.2  Objectifs specifiques"),

        h3("Pour les clients :"),
        bullet("Permettre la recherche d'artisans par categorie de metier et par ville"),
        bullet("Offrir un acces aux profils detailles des artisans (bio, portfolio, tarifs, note)"),
        bullet("Mettre a disposition un systeme d'avis et de notation (1 a 5 etoiles)"),
        bullet("Proposer un mecanisme de demande de devis direct et gratuit"),
        bullet("Garantir une experience utilisateur simple et intuitive"),

        gap(80),
        h3("Pour les artisans :"),
        bullet("Fournir un espace de creation de profil professionnel complet"),
        bullet("Permettre la mise en ligne d'un portfolio photo de realisations"),
        bullet("Offrir un tableau de bord pour gerer les demandes et y repondre"),
        bullet("Proposer des plans d'abonnement pour augmenter la visibilite"),
        bullet("Permettre de gerer sa disponibilite en temps reel"),

        gap(80),
        h3("Objectifs pedagogiques :"),
        bullet("Demontrer la maitrise d'une architecture full-stack complete"),
        bullet("Appliquer les bonnes pratiques de developpement web (REST API, JWT, bcrypt)"),
        bullet("Produire un livrable fonctionnel repondant a un besoin reel"),
        bullet("Mettre en pratique les competences de gestion de projet"),
        pgBreak(),

        // ══════════════════════ SECTION 4 ═══════════════════════════════
        sectionBanner('4', "ETUDE DE L'EXISTANT ET ANALYSE CONCURRENTIELLE"),

        h2("4.1  Solutions actuellement utilisees au Maroc"),
        mkTable(
          ['Solution', 'Type', 'Limites principales'],
          [
            ['Facebook (groupes)', 'Reseau social generaliste',    'Aucune verification, pas de notation, informel'],
            ['Instagram',          'Reseau social visuel',          'Pas de devis, aucun filtrage, pas de profil structure'],
            ['Avito.ma',           'Annonces classifiees',          'Non specialise, aucune verification, pas de dashboard'],
            ['Bouche-a-oreille',   'Recommandations personnelles',  'Non scalable, limite au reseau personnel'],
          ],
          [2000, 2600, 4400],
        ),

        gap(200),
        h2("4.2  Analyse comparative"),
        mkTable(
          ['Critere', 'Facebook', 'Avito', 'Bouche-a-oreille', 'M3alemConnect'],
          [
            ['Profils verifies',      'Non', 'Non',     'Non',    'Oui'],
            ['Systeme de notation',   'Non', 'Partiel', 'Non',    'Oui (1-5 etoiles)'],
            ['Portfolio photos',      'Partiel', 'Non', 'Non',    'Oui'],
            ['Demande de devis',      'Non', 'Non',     'Non',    'Oui'],
            ['Filtrage par ville',    'Non', 'Oui',     'Non',    'Oui'],
            ['Filtrage par metier',   'Non', 'Partiel', 'Non',    'Oui'],
            ['Dashboard artisan',     'Non', 'Non',     'Non',    'Oui'],
            ['Concu pour le Maroc',   'Non', 'Partiel', 'Oui',    'Oui'],
          ],
          [2600, 1400, 1400, 1800, 1800],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 5 ═══════════════════════════════
        sectionBanner('5', "DESCRIPTION DES ACTEURS"),

        h2("5.1  Diagramme de cas d'utilisation (Use Case)"),
        ...imgBlock(usecaseImg, "Diagramme de cas d'utilisation — M3alemConnect"),

        h2("5.2  Description des acteurs"),
        mkTable(
          ['Acteur', 'Profil', 'Besoins principaux'],
          [
            ['Client',           "Particulier ou petite entreprise cherchant un artisan",     "Trouver, comparer, contacter, noter, suivre ses devis"],
            ['Artisan',          "Travailleur independant ou petite equipe (metiers manuels)", "Creer un profil, recevoir des devis, gerer sa reputation"],
            ['Administrateur',   "Equipe Artifecta gerant la plateforme",                     "Superviser, verifier les artisans, moderer, voir les stats"],
          ],
          [1600, 3600, 3800],
        ),

        gap(200),
        h2("5.3  Categories de services"),
        mkTable(
          ['#', 'Categorie', 'Description'],
          [
            ['1', 'Plomberie',              'Reparation et installation de plomberie'],
            ['2', 'Electricite',            'Travaux electriques et installation'],
            ['3', 'Menuiserie',             'Fabrication et reparation de meubles'],
            ['4', 'Peinture',               'Peinture interieure et exterieure'],
            ['5', 'Maconnerie',             'Construction et renovation'],
            ['6', "Reparation d'appareils", 'Reparation electromenager'],
            ['7', 'Demenagement',           'Transport et demenagement'],
            ['8', 'Nettoyage',              'Nettoyage professionnel'],
          ],
          [600, 2600, 5800],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 6 ═══════════════════════════════
        sectionBanner('6', "BESOINS FONCTIONNELS"),

        h2("6.1  Module Authentification"),
        mkTable(
          ['ID', 'Fonctionnalite', 'Acteur', 'Priorite'],
          [
            ['F01', 'Inscription client (email, mot de passe, nom, ville)',    'Client',         'Haute'],
            ['F02', "Inscription artisan (+ categorie, experience, tarif)",    'Artisan',        'Haute'],
            ['F03', 'Connexion email/mot de passe avec retour JWT',            'Tous',           'Haute'],
            ['F04', 'Deconnexion securisee (invalidation du token)',           'Tous',           'Haute'],
            ['F05', 'Modification du profil personnel (nom, ville, bio)',      'Client/Artisan', 'Moyenne'],
            ['F06', "Upload d'une photo de profil (avatar)",                   'Artisan',        'Moyenne'],
          ],
          [700, 5000, 1500, 1300],
        ),

        gap(200),
        h2("6.2  Module Recherche et Decouverte"),
        mkTable(
          ['ID', 'Fonctionnalite', 'Acteur', 'Priorite'],
          [
            ['F07', 'Recherche par mot-cle (nom, metier, competence)',         'Client', 'Haute'],
            ['F08', 'Filtrage par categorie de service',                       'Client', 'Haute'],
            ['F09', 'Filtrage par ville (10 villes marocaines)',               'Client', 'Haute'],
            ['F10', 'Filtrage par note minimale (ex. : 4 etoiles et plus)',   'Client', 'Moyenne'],
            ['F11', 'Filtrage par disponibilite en temps reel',               'Client', 'Moyenne'],
            ['F12', 'Tri des resultats (mieux notes, premium, recents)',      'Client', 'Moyenne'],
            ['F13', 'Pagination des resultats (12 par page)',                  'Client', 'Basse'],
          ],
          [700, 5000, 1500, 1300],
        ),

        gap(200),
        h2("6.3  Module Profil Artisan"),
        mkTable(
          ['ID', 'Fonctionnalite', 'Acteur', 'Priorite'],
          [
            ['F14', "Affichage du profil public complet",                      'Client',  'Haute'],
            ['F15', "Bio professionnelle et presentation du metier",           'Artisan', 'Haute'],
            ['F16', "Liste des competences et services proposes",              'Artisan', 'Haute'],
            ['F17', "Tarif horaire affiche sur la fiche",                      'Artisan', 'Moyenne'],
            ['F18', "Indicateur de disponibilite (Disponible / Occupe)",       'Artisan', 'Haute'],
            ['F19', "Upload et affichage de photos de portfolio",              'Artisan', 'Haute'],
            ['F20', "Badge 'Verifie' (accorde par l'administrateur)",         'Admin',   'Haute'],
            ['F21', "Badge 'Premium' (actif via abonnement en cours)",        'Artisan', 'Haute'],
            ['F22', "Compteur de vues du profil (incremente a chaque visite)", 'Artisan', 'Basse'],
          ],
          [700, 5000, 1500, 1300],
        ),

        gap(200),
        h2("6.4  Module Avis et Notation"),
        mkTable(
          ['ID', 'Fonctionnalite', 'Acteur', 'Priorite'],
          [
            ['F23', "Laisser une note de 1 a 5 etoiles a un artisan",         'Client',  'Haute'],
            ['F24', "Rediger un commentaire associe a la note",                'Client',  'Haute'],
            ['F25', "Un seul avis par client par artisan (contrainte unique)", 'Systeme', 'Haute'],
            ['F26', "Calcul et affichage de la note moyenne du profil",       'Systeme', 'Haute'],
            ['F27', "Moderation des avis par l'administrateur",               'Admin',   'Moyenne'],
          ],
          [700, 5000, 1500, 1300],
        ),

        gap(200),
        h2("6.5  Module Demande de Devis"),
        mkTable(
          ['ID', 'Fonctionnalite', 'Acteur', 'Priorite'],
          [
            ['F28', "Envoi d'une demande de devis a un artisan specifique",   'Client',  'Haute'],
            ['F29', "Champs : description, ville, budget min/max",             'Client',  'Haute'],
            ['F30', "Reception et consultation des devis recus",              'Artisan', 'Haute'],
            ['F31', "Reponse de l'artisan (texte + prix propose)",            'Artisan', 'Haute'],
            ['F32', "Refus d'un devis par l'artisan",                         'Artisan', 'Haute'],
            ['F33', "Historique complet des devis envoyes",                   'Client',  'Haute'],
            ['F34', "Marquage d'une mission comme terminee",                  'Client',  'Moyenne'],
            ['F35', "Statuts : En attente / Lu / Repondu / Refuse / Termine", 'Systeme', 'Haute'],
          ],
          [700, 5000, 1500, 1300],
        ),

        gap(200),
        h2("6.6  Module Abonnements"),
        mkTable(
          ['Plan', 'Tarif', 'Duree', 'Avantages principaux'],
          [
            ['Gratuit', '0 MAD',   '30 jours', "Profil de base, 5 devis/mois, visible dans la recherche"],
            ['Pro',     '199 MAD', '30 jours', "Profil mis en avant, badge verifie, devis illimites, statistiques"],
            ['Premium', '399 MAD', '30 jours', "Position sponsorisee, badge Premium, support dedie, stats avancees"],
          ],
          [1400, 1200, 1200, 5200],
          C.EMERALD,
        ),
        pgBreak(),

        // ══════════════════════ SECTION 7 ═══════════════════════════════
        sectionBanner('7', "BESOINS NON FONCTIONNELS"),

        mkTable(
          ['Critere', 'Exigence'],
          [
            ['Performance',    'Chargement des pages < 3 s — Reponse API < 500 ms'],
            ['Securite',       'Authentification JWT — Hachage bcrypt (cout 12) — Validation serveur (express-validator)'],
            ['Ergonomie',      'Interface responsive mobile/tablette/desktop — Maximum 3 clics pour toute action cle'],
            ['Compatibilite',  'Chrome, Firefox, Edge, Safari (versions modernes)'],
            ['Maintenabilite', "Code modulaire, variables d'environnement (.env), commentaires cles"],
            ['Scalabilite',    "API REST stateless — Pagination systematique — Architecture extensible"],
            ['Uploads',        "Images uniquement (JPG, PNG, WebP) — Taille max 5 Mo — Stockage local /uploads"],
          ],
          [2400, 6600],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 8 ═══════════════════════════════
        sectionBanner('8', "ARCHITECTURE TECHNIQUE"),

        h2("8.1  Stack technologique"),
        mkTable(
          ['Couche', 'Technologie', 'Justification'],
          [
            ['Frontend',          'React.js 18 + Vite',      "Composants reutilisables, HMR instantane, standard industrie"],
            ['Styles',            'Tailwind CSS',             "CSS utilitaire, responsive natif, design system coherent"],
            ['Animations',        'Framer Motion',            "Animations fluides et professionnelles"],
            ['Backend',           'Node.js + Express',        "JavaScript full-stack, leger, adapte aux APIs REST"],
            ['Base de donnees',   'MySQL (XAMPP)',            "Relationnel, robuste, adapte aux donnees structurees"],
            ['Authentification',  'JWT + bcryptjs',           "Standard industrie, stateless, securise"],
            ['Upload fichiers',   'Multer',                   "Gestion multipart, validation integree"],
            ['Validation',        'express-validator',        "Validation serveur robuste des entrees utilisateur"],
          ],
          [1800, 2200, 5000],
        ),

        gap(200),
        h2("8.2  Diagramme d'architecture systeme"),
        ...imgBlock(archImg, "Architecture systeme — M3alemConnect"),
        pgBreak(),

        // ══════════════════════ SECTION 9 ═══════════════════════════════
        sectionBanner('9', "MODELISATION DE LA BASE DE DONNEES"),

        h2("9.1  Diagramme Entite-Association (MCD)"),
        ...imgBlock(erImg, "Diagramme Entite-Association — Base de donnees M3alemConnect"),

        h2("9.2  Description des tables"),
        mkTable(
          ['Table', 'Description', 'Cle primaire'],
          [
            ['users',                  "Tous les comptes (clients, artisans, administrateurs)",     'id'],
            ['categories',             "Les 8 categories de metiers disponibles",                  'id'],
            ['artisan_profiles',       "Profil professionnel d'un artisan (BDD, bio, tarif)",      'id'],
            ['artisan_skills',         "Competences declarees par un artisan",                     'id'],
            ['portfolio_photos',       "Photos de realisations uploadees par un artisan",          'id'],
            ['reviews',                "Avis et notes laisses par les clients",                    'id'],
            ['quote_requests',         "Demandes de devis envoyees par les clients",               'id'],
            ['subscription_plans',     "Plans d'abonnement disponibles sur la plateforme",         'id'],
            ['artisan_subscriptions',  "Abonnements souscrits par les artisans",                   'id'],
          ],
          [2600, 4800, 1600],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 10 ══════════════════════════════
        sectionBanner('10', "CONTRAINTES DU PROJET"),

        mkTable(
          ['Type', 'Contrainte'],
          [
            ['Technique',    "Fonctionnement en local uniquement (XAMPP/WAMP) — Pas d'hebergement externe requis"],
            ['Technique',    "Pas de dependance a des services externes payants (API, CDN, etc.)"],
            ['Technique',    "Stockage des images localement sur le serveur (dossier /uploads)"],
            ['Humaine',      "Equipe de 3 personnes etudiantes aux disponibilites limitees"],
            ['Humaine',      "Aucun budget alloue pour l'hebergement, le marketing ou les services SaaS"],
            ['Fonctionnelle', "Paiement en ligne non inclus dans cette version (MVP)"],
            ['Fonctionnelle', "Notifications email / SMS reportees a la version suivante"],
            ['Fonctionnelle', "Messagerie en temps reel (WebSocket) hors perimetre MVP"],
            ['Fonctionnelle', "Geolocalisation GPS hors perimetre MVP"],
          ],
          [2000, 7000],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 11 ══════════════════════════════
        sectionBanner('11', "PLANNING PREVISIONNEL"),

        h2("11.1  Diagramme de Gantt"),
        ...imgBlock(ganttImg, "Diagramme de Gantt — Planning M3alemConnect (janv. – avr. 2025)"),

        h2("11.2  Phases du projet"),
        mkTable(
          ['Phase', 'Contenu', 'Duree'],
          [
            ['Phase 1 — Analyse',        "Etude de marche, maquettes, modelisation BDD, CDC",       '2 semaines'],
            ['Phase 2 — Mise en place',  "Configuration environnement, design system, BDD",         '1 semaine'],
            ['Phase 3 — Backend',        "API REST complete (auth, artisans, avis, devis, admin)",  '3 semaines'],
            ['Phase 4 — Frontend',       "Pages React, integration API, responsive design",         '3 semaines'],
            ['Phase 5 — Tests',          "Tests fonctionnels, correction des bugs, optimisation",   '1 semaine'],
            ['Phase 6 — Finalisation',   "Documentation, CDC final, preparation jury",              '1 semaine'],
            ['TOTAL', '', '~ 11 semaines'],
          ],
          [2200, 5200, 1600],
        ),

        gap(200),
        h2("11.3  Repartition des taches"),
        mkTable(
          ['Tache', 'Ayoub (Backend)', 'Alae (Frontend)', 'Abdlwadoud (Marketing)'],
          [
            ["Maquettes et design",    "Support",     "Principal", "Support"],
            ["Base de donnees",        "Principal",   "—",         "—"],
            ["API REST",               "Principal",   "—",         "Support"],
            ["Pages React",            "Support",     "Principal", "—"],
            ["Integration API",        "Support",     "Principal", "—"],
            ["Documentation / CDC",    "Co-auteur",   "Support",   "Co-auteur"],
            ["Tests et recettes",      "Oui",         "Oui",       "Oui"],
          ],
          [2500, 2000, 2000, 2500],
        ),
        pgBreak(),

        // ══════════════════════ SECTION 12 ══════════════════════════════
        sectionBanner('12', "CONCLUSION"),

        para("M3alemConnect est un projet ambitieux et ancre dans une realite marocaine concrete. Il repond a un besoin reel et non satisfait : la mise en relation structuree, fiable et transparente entre les particuliers et les artisans qualifies de Casablanca, avec une vision d'extension nationale."),
        gap(120),
        para("En combinant les meilleures pratiques du developpement web moderne (React, Node.js, MySQL) avec une identite visuelle forte inspiree de la culture marocaine, M3alemConnect apporte une reelle valeur ajoutee a deux categories d'acteurs economiques souvent laisses pour compte par la digitalisation."),
        gap(120),
        para("Dans le cadre de ce projet de fin d'etudes, M3alemConnect constitue egalement une demonstration technique complete de la capacite de l'equipe Artifecta a concevoir, developper et livrer un produit numerique professionnel et fonctionnel de bout en bout."),
        gap(200),
        quoteBox("Au-dela du projet scolaire, M3alemConnect represente une opportunite entrepreneuriale reelle, avec un potentiel d'extension a l'ensemble des grandes villes du Maroc."),
        pgBreak(),

        // ══════════════════════ SECTION 13 ══════════════════════════════
        sectionBanner('13', "GLOSSAIRE"),

        mkTable(
          ['Terme', 'Definition'],
          [
            ['API REST',         "Interface de programmation suivant l'architecture REST, communication via HTTP"],
            ['JWT',              "JSON Web Token — standard d'authentification securise sans etat (stateless)"],
            ['MVP',              "Minimum Viable Product — version minimale fonctionnelle d'un produit"],
            ['Marketplace',      "Plateforme mettant en relation des offreurs et des demandeurs de services"],
            ['Full-stack',       "Developpement couvrant le frontend (interface) et le backend (serveur + BDD)"],
            ['Responsive',       "Interface s'adaptant automatiquement a tous les formats d'ecran"],
            ['Bcrypt',           "Algorithme de hachage cryptographique pour securiser les mots de passe"],
            ['CRUD',             "Create, Read, Update, Delete — les quatre operations de base sur les donnees"],
            ['UI/UX',            "User Interface / User Experience — conception interface et experience utilisateur"],
            ['Dashboard',        "Tableau de bord donnant une vue synthetique des informations cles"],
            ['Badge verifie',    "Indicateur visuel confirmant l'authenticite d'un artisan sur la plateforme"],
            ['Artisan',          "Professionnel qualifie dans un metier manuel (plombier, electricien, etc.)"],
            ['Multer',           "Middleware Node.js pour la gestion des uploads de fichiers multipart"],
            ['Vite',             "Outil de build ultra-rapide pour les applications React/JS modernes"],
          ],
          [2600, 6400],
        ),

        gap(400),
        new Paragraph({
          children: [new TextRun({
            text: "Document redige par l'agence Artifecta  ·  Juin 2025",
            size: 17, italics: true, color: C.MUTED, font: 'Calibri',
          })],
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.SAFFRON, space: 8 } },
          spacing: { before: 400, after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'M3alemConnect — Al-Harfi Al-Munasib',
            size: 22, bold: true, color: C.NAVY, font: 'Calibri',
          })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
        }),

      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outFile = path.join(__dirname, '..', 'M3alemConnect_CDC.docx');
  fs.writeFileSync(outFile, buffer);

  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`\n✅ Document generated successfully!`);
  console.log(`   Path : ${outFile}`);
  console.log(`   Size : ${sizeKB} KB\n`);
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
