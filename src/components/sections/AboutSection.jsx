import { motion } from "framer-motion";
import { teamMembers } from "../../constants/site";

const highlights = [
  { value: "20+", label: "Projets livrés" },
  { value: "3", label: "Experts clés" },
  { value: "100%", label: "Clients satisfaits" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full overflow-hidden"
      style={{ background: "#f0f5fa" }}
    >
      {/* Agency intro */}
      <div className="px-8 pt-24 pb-16" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ width: "28px", height: "2px", background: "#142638" }} />
          <span
            className="font-unbounded font-medium tracking-widest uppercase"
            style={{ fontSize: "0.7rem", color: "#142638", opacity: 0.5 }}
          >
            À propos
          </span>
        </motion.div>

        <motion.h2
          className="font-unbounded font-bold mb-14"
          style={{
            fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
            color: "#142638",
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            maxWidth: "880px",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          Nous sommes{" "}
          <span className="text-outlined-lg">Artifecta</span> — une agence digitale
          fondée sur l’excellence du design, la précision de l’ingénierie et la
          croissance stratégique.
        </motion.h2>

        <div className="flex flex-wrap gap-12">
          <motion.div
            style={{ flex: "1 1 420px" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p
              className="font-body mb-5"
              style={{
                color: "#142638",
                opacity: 0.75,
                fontSize: "1.05rem",
                lineHeight: 1.8,
              }}
            >
              Basés à Casablanca, au Maroc, nous allions créativité et technologie
              pour concevoir des produits digitaux qui se démarquent. De l’identité
              de marque au développement full-stack, en passant par l’intégration de
              l’IA — nous couvrons l’ensemble du spectre digital.
            </p>
            <p
              className="font-body"
              style={{
                color: "#142638",
                opacity: 0.6,
                fontSize: "1.05rem",
                lineHeight: 1.8,
              }}
            >
              Notre équipe resserrée de trois experts offre des résultats dignes
              d’une grande agence, avec l’agilité et l’attention personnalisée d’un
              studio à taille humaine. Chaque projet est traité comme un travail
              d’artisan, pas comme un simple livrable.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center gap-8"
            style={{ flex: "0 0 auto" }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            {highlights.map((h) => (
              <div key={h.label}>
                <div
                  className="font-unbounded font-bold"
                  style={{ fontSize: "2.4rem", color: "#142638", lineHeight: 1 }}
                >
                  {h.value}
                </div>
                <div
                  className="font-body text-sm mt-1"
                  style={{ color: "#142638", opacity: 0.5 }}
                >
                  {h.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: "1px", background: "rgba(20,38,56,0.1)" }} />
      </div>

      {/* Team section */}
      <div className="px-8 pt-16 pb-24" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ width: "28px", height: "2px", background: "#142638" }} />
          <span
            className="font-unbounded font-medium tracking-widest uppercase"
            style={{ fontSize: "0.7rem", color: "#142638", opacity: 0.5 }}
          >
            L’équipe
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="relative overflow-hidden"
              style={{
                borderRadius: "20px",
                background: "#142638",
                padding: "36px 32px 32px",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
            >
              {/* Avatar */}
              <div
                className="flex items-center justify-center font-unbounded font-bold mb-7"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "14px",
                  background: "rgba(169,194,216,0.12)",
                  border: "1px solid rgba(169,194,216,0.18)",
                  color: "#a9c2d8",
                  fontSize: "1.1rem",
                  letterSpacing: "-0.03em",
                }}
              >
                {member.initials}
              </div>

              <h3
                className="font-unbounded font-bold text-white mb-1"
                style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
              >
                {member.name}
              </h3>
              <p
                className="font-body font-medium mb-1"
                style={{ fontSize: "0.85rem", color: "#a9c2d8" }}
              >
                {member.role}
              </p>
              <p
                className="font-body"
                style={{ fontSize: "0.8rem", color: "rgba(169,194,216,0.5)" }}
              >
                {member.specialty}
              </p>

              {/* Decorative circle */}
              <div
                className="absolute"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "rgba(169,194,216,0.04)",
                  border: "1px solid rgba(169,194,216,0.07)",
                  top: "-24px",
                  right: "-24px",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
