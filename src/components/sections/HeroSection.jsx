import { motion } from "framer-motion";
import Navbar from "../Navbar";
import { HERO_SRC } from "../../constants/site";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full"
      style={{ minHeight: "125vh", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_SRC})`,
          backgroundSize: "cover",
          backgroundPosition: "center -50%",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(169,194,216,0.18)",
        }}
      />

      <Navbar />

      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: "200px", paddingBottom: "140px", minHeight: "125vh" }}
      >
        <motion.h1
          className="font-unbounded font-bold leading-tight mb-6"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 4.2rem)",
            color: "#142638",
            maxWidth: "1440px",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <span className="hero-line">
            La fusion parfaite de <span className="text-outlined">l’IA,</span>
          </span>
          <span className="text-outlined hero-line">du Design et de l’Ingénierie</span>
        </motion.h1>

        <motion.p
          className="font-body font-bold mb-10"
          style={{
            color: "#142638",
            fontSize: "1.2rem",
            maxWidth: "640px",
            lineHeight: 1.6,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
        >
          Nous concevons des expériences digitales évolutives, portées par le
          design, la technologie et l’intelligence artificielle.
        </motion.p>

        <motion.a
          href="#contact"
          className="font-body font-medium flex items-center gap-3 px-8 py-4 rounded-full"
          style={{
            background: "rgba(255,255,255,0.75)",
            color: "#142638",
            fontSize: "1rem",
            textDecoration: "none",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 4px 24px rgba(20,38,56,0.12)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          whileHover={{ scale: 1.06, boxShadow: "0 8px 32px rgba(20,38,56,0.22)" }}
          whileTap={{ scale: 0.97 }}
        >
          Démarrer un projet
          <motion.span
            style={{ fontSize: "1.1rem", display: "inline-block" }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
