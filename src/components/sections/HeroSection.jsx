import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Navbar from "../Navbar";
import { EASE } from "../motion";
import { HERO_SRC } from "../../constants/site";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Parallax: the background drifts down slower than the page while the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full"
      style={{ minHeight: "125vh", overflow: "hidden" }}
    >
      {/* Background with a slow, endless zoom (Ken Burns effect) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_SRC})`,
          backgroundSize: "cover",
          backgroundPosition: "center -50%",
          backgroundRepeat: "no-repeat",
          y: reduceMotion ? 0 : backgroundY,
          willChange: "transform",
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.08] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
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
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
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
          transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
        >
          Nous concevons des expériences digitales évolutives, portées par le
          design, la technologie et l’intelligence artificielle.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
        >
          <a href="#contact" className="hero-cta hero-cta-primary">
            Démarrer un projet
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#services" className="hero-cta hero-cta-secondary">
            Découvrir nos services
          </a>
        </motion.div>

        <motion.div
          style={{ marginTop: "56px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <a href="#about" className="scroll-hint" aria-label="Défiler vers la suite">
            <span className="scroll-hint-mouse" aria-hidden="true">
              <motion.span
                className="scroll-hint-wheel"
                animate={reduceMotion ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            Défiler
          </a>
        </motion.div>
      </div>
    </section>
  );
}
