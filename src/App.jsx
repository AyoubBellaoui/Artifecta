import { MotionConfig } from "framer-motion";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/sections/Footer";
import HeroSection from "./components/sections/HeroSection";
import ServicesSection from "./components/sections/ServicesSection";
import TechSection from "./components/sections/TechSection";
import WorkSection from "./components/sections/WorkSection";

export default function App() {
  return (
    // Animations follow the visitor's "reduce motion" system setting.
    <MotionConfig reducedMotion="user">
      <div style={{ width: "100%", overflowX: "hidden" }}>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TechSection />
        <WorkSection />
        <ContactSection />
        <Footer />
      </div>
    </MotionConfig>
  );
}
