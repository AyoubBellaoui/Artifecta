import { motion } from "framer-motion";
import { techStack } from "../../constants/techStack";
import { Marquee } from "../motion";

export default function TechSection() {
  return (
    <section className="w-full py-16" style={{ background: "#0f1d2c" }}>
      <div className="px-8">
        <motion.div
          className="flex items-center gap-3"
          style={{ maxWidth: "1200px", margin: "0 auto 40px" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ width: "28px", height: "2px", background: "#a9c2d8", opacity: 0.5 }} />
          <span
            className="font-unbounded font-medium tracking-widest uppercase"
            style={{ fontSize: "0.7rem", color: "#a9c2d8", opacity: 0.5 }}
          >
            Notre stack
          </span>
        </motion.div>
      </div>

      {/* Logos scroll endlessly; hovering pauses the band */}
      <Marquee duration={45} label="Technologies utilisées">
        {techStack.map((tech) => (
          <li key={tech.name} className="tech-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={tech.path} />
            </svg>
            <span className="font-unbounded">{tech.name}</span>
          </li>
        ))}
      </Marquee>
    </section>
  );
}
