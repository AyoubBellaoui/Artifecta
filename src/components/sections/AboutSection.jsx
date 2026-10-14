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
              className="team-card overflow-hidden"
              style={{
                borderRadius: "20px",
                background: "#ffffff",
                border: "1px solid rgba(20,38,56,0.08)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              {/* Cover band with the profile picture overlapping it, as on Facebook */}
              <div style={{ background: "#a9c2d8", height: "110px" }} />

              <div style={{ padding: "0 28px 28px" }}>
                <div className="team-avatar">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} />
                  ) : (
                    // Default profile silhouette until a real photo is added
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <circle cx="50" cy="38" r="18" />
                      <ellipse cx="50" cy="94" rx="34" ry="30" />
                    </svg>
                  )}
                </div>

                <h3
                  className="font-unbounded font-bold mb-2 mt-4"
                  style={{ fontSize: "1.05rem", color: "#142638", letterSpacing: "-0.01em" }}
                >
                  {member.name}
                </h3>
                <p
                  className="font-body font-medium"
                  style={{ fontSize: "0.9rem", color: "#142638", margin: 0 }}
                >
                  {member.role}
                </p>
                {member.specialty && (
                  <p
                    className="font-body"
                    style={{ fontSize: "0.85rem", color: "#142638", opacity: 0.55, margin: "2px 0 0" }}
                  >
                    {member.specialty}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
