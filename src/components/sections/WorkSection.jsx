import { motion } from "framer-motion";
import { projects } from "../../constants/site";

function FeaturedCard({ project }) {
  return (
    <motion.article
      className="relative overflow-hidden w-full"
      style={{ borderRadius: "24px", background: "#ffffff" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      <div className="flex flex-col md:flex-row" style={{ minHeight: "420px" }}>
        {/* Left panel: logo */}
        <div
          className="flex items-center justify-center"
          style={{
            background: "#ffffff",
            flex: "0 0 42%",
            minHeight: "280px",
            padding: "48px 40px",
          }}
        >
          <img
            src={project.logo}
            alt={project.title}
            style={{
              maxWidth: "340px",
              maxHeight: "280px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Right panel: content */}
        <div
          className="flex flex-col justify-end relative"
          style={{
            background: "#142638",
            flex: 1,
            padding: "48px",
            borderLeft: "none",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(200,160,74,0.1)",
                border: "1px solid rgba(200,160,74,0.35)",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#c8a04a",
                }}
              />
              <span
                className="font-unbounded font-medium"
                style={{
                  fontSize: "0.62rem",
                  color: "#c8a04a",
                  letterSpacing: "0.12em",
                }}
              >
                PROJET CONCEPT
              </span>
            </div>

            <h3
              className="font-unbounded font-bold mb-3"
              style={{ fontSize: "2rem", letterSpacing: "-0.02em", color: "#ffffff" }}
            >
              {project.title}
            </h3>
            <p
              className="font-body mb-6"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "400px",
              }}
            >
              {project.description}
            </p>
            <div className="flex gap-2 flex-wrap mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-unbounded font-medium"
                style={{
                  background: "#c8a04a",
                  color: "#142638",
                  padding: "12px 24px",
                  borderRadius: "100px",
                  fontSize: "0.75rem",
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  width: "fit-content",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Voir le site concept
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="#142638" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.article
      className="relative overflow-hidden"
      style={{
        background: project.gradient,
        borderRadius: "20px",
        minHeight: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "36px",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3
          className="font-unbounded font-bold text-white mb-3"
          style={{ fontSize: "1.8rem", letterSpacing: "-0.02em" }}
        >
          {project.title}
        </h3>
        {project.description && (
          <p
            className="font-body text-sm mb-4"
            style={{
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.65,
              maxWidth: "340px",
            }}
          >
            {project.description}
          </p>
        )}
        <div className="flex gap-3 flex-wrap">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-body text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function WorkSection() {
  const [featured, ...rest] = projects;

  return (
    <section id="work" className="w-full px-8 py-20" style={{ background: "#a9c2d8" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div className="mb-12">
          <motion.div
            className="flex items-center gap-3 mb-4"
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
              Portfolio
            </span>
          </motion.div>

          <motion.h2
            className="font-unbounded font-bold"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#142638",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Nos réalisations
          </motion.h2>
        </div>

        {/* Featured card */}
        {featured?.featured && (
          <div className="mb-5">
            <FeaturedCard project={featured} />
          </div>
        )}
      </div>
    </section>
  );
}
