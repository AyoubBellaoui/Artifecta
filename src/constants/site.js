export const LOGO_SRC = "/LG.png";
export const HERO_SRC = "/hero-bg.jpeg";
export const CONTACT_IMAGE_SRC = "/Contact bg.png";

// Contact form delivery. Get a key at web3forms.com by entering the inbox that should receive
// messages. The key is meant to be used in the browser, so it is safe to keep here.
export const WEB3FORMS_ACCESS_KEY = "8f7404e0-adc3-4ecb-94d1-aa3623c8776a";

export const navLinks = [
  { href: "#about", label: "À propos" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Réalisations" },
];

// Team photos: put a square picture (about 400×400, face centred) in public/team/ and uncomment the
// member's `photo` line. Without a photo, or if the file is missing, the card shows the default avatar.
export const teamMembers = [
  {
    name: "Ayoub B.",
    initials: "AB",
    role: "Chef de groupe",
    specialty: "Développement Full Stack",
    // photo: "/team/ayoub.webp",
  },
  {
    name: "Alaa",
    initials: "AL",
    role: "Développement Frontend",
    specialty: "Design UI/UX",
    // photo: "/team/alaa.webp",
  },
  {
    name: "Abdelwadoud",
    initials: "AW",
    role: "Développement Backend",
    // photo: "/team/abdelwadoud.webp",
  },
];

export const projectTypes = [
  "Site web",
  "Application web",
  "Design UI/UX",
  "Identité de marque",
  "Intégration IA",
  "Autre",
];

export const projects = [
  {
    title: "M3alemConnect",
    description:
      "Une plateforme intelligente qui met en relation les propriétaires marocains avec des artisans qualifiés pour la construction, la rénovation et les réparations — trouvez le bon professionnel, rapidement.",
    tags: ["Design de plateforme", "Développement web", "UX/UI"],
    gradient: "linear-gradient(135deg, #0f2744, #1a4a8a)",
    accentColor: "#c8a04a",
    logo: "/WhatsApp Image 2026-05-05 at 14.37.32.jpeg",
    url: "https://m3alemconnect.vercel.app",
    featured: true,
  },
  {
    title: "Zupitar",
    description: "Une plateforme musicale dynamique, à l’expérience fluide et au motion design soigné.",
    tags: ["Design produit", "Motion design"],
    gradient: "linear-gradient(135deg, #e52d5e, #ff4d6d)",
  },
  {
    title: "Nexora",
    description: "Un tableau de bord analytique propulsé par l’IA, conçu pour les équipes guidées par la donnée.",
    tags: ["Design produit", "Développement"],
    gradient: "linear-gradient(135deg, #f77f00, #fcbf49)",
  },
];

export const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Twitter" },
];
