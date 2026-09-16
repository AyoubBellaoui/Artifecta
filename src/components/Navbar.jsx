import { motion } from "framer-motion";
import { LOGO_SRC, navLinks } from "../constants/site";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 }}
      className="relative flex items-center justify-between px-8 py-5"
    >
      <div className="flex items-center gap-2">
        <img
          src={LOGO_SRC}
          alt="Logo Artifecta"
          style={{ width: 60, height: 55, objectFit: "contain" }}
        />
        <span
          className="font-unbounded text-sm font-semibold tracking-widest"
          style={{ color: "#142638" }}
        >
          ARTIFECTA
        </span>
      </div>

      <div
        className="hidden md:flex items-center gap-8 font-body text-sm absolute left-1/2 -translate-x-1/2"
        style={{ color: "#142638" }}
      >
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className="nav-link">
            {link.label}
          </a>
        ))}
      </div>

      <motion.a
        href="#contact"
        className="font-body text-sm px-5 py-2 rounded-full border font-medium"
        style={{
          color: "#142638",
          borderColor: "#142638",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(4px)",
          textDecoration: "none",
        }}
        whileHover={{
          scale: 1.06,
          background: "rgba(20,38,56,1)",
          color: "#ffffff",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25 }}
      >
        Contact
      </motion.a>
    </motion.nav>
  );
}
