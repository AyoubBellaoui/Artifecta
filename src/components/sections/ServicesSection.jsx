import { motion } from "framer-motion";
import { EASE } from "../motion";

const services = [
  {
    number: "01",
    icon: "brand",
    title: "Identité de marque",
    description:
      "Des identités visuelles distinctives — logos, typographies et palettes de couleurs — qui rendent votre marque immédiatement reconnaissable et inoubliable.",
    deliverables: ["Logo", "Charte graphique", "Typographies"],
  },
  {
    number: "02",
    icon: "uiux",
    title: "Design UI/UX",
    description:
      "Des interfaces intuitives et des parcours utilisateurs fluides, pensés pour maximiser l’engagement, l’ergonomie et la conversion à chaque point de contact.",
    deliverables: ["Wireframes", "Prototypes", "Design system"],
  },
  {
    number: "03",
    icon: "web",
    title: "Web design",
    description:
      "Des sites modernes, responsives et visuellement percutants, qui reflètent les valeurs de votre marque et transforment vos visiteurs en clients.",
    deliverables: ["Maquettes", "Responsive", "Landing pages"],
  },
  {
    number: "04",
    icon: "code",
    title: "Développement web",
    description:
      "Des applications web rapides, évolutives et sécurisées, construites avec des technologies de pointe et les meilleures pratiques d’ingénierie.",
    deliverables: ["Sites React", "API", "Mise en ligne"],
  },
  {
    number: "05",
    icon: "ai",
    title: "Intégration IA",
    description:
      "Automatisation intelligente, chatbots et fonctionnalités propulsées par l’IA pour enrichir votre produit digital et réduire vos coûts opérationnels.",
    deliverables: ["Chatbots", "Automatisation", "Intégrations"],
  },
  {
    number: "06",
    icon: "product",
    title: "Produits digitaux",
    description:
      "Un accompagnement de bout en bout — de la stratégie et du concept au design, au développement, au lancement et à l’amélioration continue.",
    deliverables: ["Stratégie", "MVP", "Suivi"],
  },
];

// Line icons drawn in currentColor, so they follow the card's hover colour swap.
const ICONS = {
  brand: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M12 21 8 9l4-6 4 6-4 12" />
    </>
  ),
  uiux: (
    <>
      <rect x="2" y="3" width="16" height="13" rx="2" />
      <path d="M2 7h16" />
      <path d="m13 12 8.5 3.2-3.6 1.3-1.3 3.6z" />
    </>
  ),
  web: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20M6 13h7M6 16h10" />
    </>
  ),
  code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />,
  ai: (
    <>
      <path d="m11 3 1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7L4.5 9.5l4.7-1.8z" />
      <path d="m18.5 14 .9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" />
    </>
  ),
  product: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 12.5l9 5 9-5M3 17l9 5 9-5" />,
};

function ServiceIcon({ name }) {
  return (
    <span className="service-card-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}

// The grid reveals its cards one after another.
const GRID = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const CARD = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="w-full px-8 py-24"
      style={{ background: "#142638" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-16">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{ width: "28px", height: "2px", background: "#a9c2d8", opacity: 0.5 }}
            />
            <span
              className="font-unbounded font-medium tracking-widest uppercase"
              style={{ fontSize: "0.7rem", color: "#a9c2d8", opacity: 0.5 }}
            >
              Nos expertises
            </span>
          </motion.div>

          <motion.h2
            className="font-unbounded font-bold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              maxWidth: "760px",
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            Des services{" "}
            <span
              className="font-style-script"
              style={{ fontSize: "1.1em", color: "#a9c2d8", fontWeight: 400 }}
            >
              sur mesure
            </span>{" "}
            pour votre vision.
          </motion.h2>
        </div>

        {/* Service cards: hovering inverts a card to the light brand blue */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={GRID}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((service) => (
            <motion.article
              key={service.title}
              className="service-card"
              variants={CARD}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <div className="flex items-start justify-between gap-4">
                <ServiceIcon name={service.icon} />
                <span className="service-card-number font-unbounded">{service.number}</span>
              </div>
              <h3 className="service-card-title font-unbounded font-bold">{service.title}</h3>

              <p className="service-card-text font-body text-sm leading-relaxed">
                {service.description}
              </p>

              <ul className="service-card-deliverables font-body">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
