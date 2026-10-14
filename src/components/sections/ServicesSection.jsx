import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Identité de marque",
    description:
      "Des identités visuelles distinctives — logos, typographies et palettes de couleurs — qui rendent votre marque immédiatement reconnaissable et inoubliable.",
    deliverables: ["Logo", "Charte graphique", "Typographies"],
  },
  {
    number: "02",
    title: "Design UI/UX",
    description:
      "Des interfaces intuitives et des parcours utilisateurs fluides, pensés pour maximiser l’engagement, l’ergonomie et la conversion à chaque point de contact.",
    deliverables: ["Wireframes", "Prototypes", "Design system"],
  },
  {
    number: "03",
    title: "Web design",
    description:
      "Des sites modernes, responsives et visuellement percutants, qui reflètent les valeurs de votre marque et transforment vos visiteurs en clients.",
    deliverables: ["Maquettes", "Responsive", "Landing pages"],
  },
  {
    number: "04",
    title: "Développement web",
    description:
      "Des applications web rapides, évolutives et sécurisées, construites avec des technologies de pointe et les meilleures pratiques d’ingénierie.",
    deliverables: ["Sites React", "API", "Mise en ligne"],
  },
  {
    number: "05",
    title: "Intégration IA",
    description:
      "Automatisation intelligente, chatbots et fonctionnalités propulsées par l’IA pour enrichir votre produit digital et réduire vos coûts opérationnels.",
    deliverables: ["Chatbots", "Automatisation", "Intégrations"],
  },
  {
    number: "06",
    title: "Produits digitaux",
    description:
      "Un accompagnement de bout en bout — de la stratégie et du concept au design, au développement, au lancement et à l’amélioration continue.",
    deliverables: ["Stratégie", "MVP", "Suivi"],
  },
];

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
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {services.map((service) => (
            <article key={service.title} className="service-card">
              <div className="flex items-start justify-between gap-4">
                <h3 className="service-card-title font-unbounded font-bold">{service.title}</h3>
                <span className="service-card-number font-unbounded">{service.number}</span>
              </div>

              <p className="service-card-text font-body text-sm leading-relaxed">
                {service.description}
              </p>

              <ul className="service-card-deliverables font-body">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
