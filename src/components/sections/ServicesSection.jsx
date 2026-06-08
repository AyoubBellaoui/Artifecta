import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Brand Identity",
    description:
      "Distinctive visual identities — logos, typography, and color systems — that make your brand instantly recognizable and unforgettable.",
  },
  {
    number: "02",
    title: "UI/UX Design",
    description:
      "Intuitive interfaces and seamless user journeys crafted to maximize engagement, usability, and conversion across every touchpoint.",
  },
  {
    number: "03",
    title: "Web Design",
    description:
      "Modern, responsive, and visually compelling websites that reflect your brand values and turn visitors into customers.",
  },
  {
    number: "04",
    title: "Web Development",
    description:
      "Fast, scalable, and secure web applications built with cutting-edge technologies and engineering best practices.",
  },
  {
    number: "05",
    title: "AI Integration",
    description:
      "Smart automation, chatbots, and AI-powered features that enhance your digital product and cut operational overhead.",
  },
  {
    number: "06",
    title: "Digital Products",
    description:
      "End-to-end product development — from concept and strategy to design, development, launch, and continuous iteration.",
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
              What We Do
            </span>
          </motion.div>

          <motion.h2
            className="font-unbounded font-bold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              maxWidth: "680px",
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            Services{" "}
            <span
              className="font-style-script"
              style={{ fontSize: "1.1em", color: "#a9c2d8", fontWeight: 400 }}
            >
              tailored
            </span>{" "}
            for your vision.
          </motion.h2>
        </div>

        {/* Service card grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{
            gap: "1px",
            background: "rgba(169,194,216,0.08)",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(169,194,216,0.08)",
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="relative p-8"
              style={{ background: "#142638", cursor: "default" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.07 }}
              whileHover={{ background: "#1b3350" }}
            >
              <div
                className="font-unbounded font-bold mb-6"
                style={{
                  fontSize: "0.65rem",
                  color: "#a9c2d8",
                  opacity: 0.3,
                  letterSpacing: "0.15em",
                }}
              >
                {service.number}
              </div>

              <h3
                className="font-unbounded font-bold mb-4"
                style={{
                  fontSize: "1.05rem",
                  color: "#ffffff",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                {service.title}
              </h3>

              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "rgba(169,194,216,0.55)" }}
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
