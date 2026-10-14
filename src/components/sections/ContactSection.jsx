import { useState } from "react";
import { motion } from "framer-motion";
import { CONTACT_IMAGE_SRC, WEB3FORMS_ACCESS_KEY, projectTypes } from "../../constants/site";

const SEND_ERROR_MESSAGE =
  "Impossible d’envoyer votre message pour le moment. Veuillez réessayer.";

const initialForm = {
  name: "",
  email: "",
  projectType: "",
  message: "",
  // Honeypot: hidden from people, so only bots tick it. Web3Forms drops those submissions.
  botcheck: false,
};

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!WEB3FORMS_ACCESS_KEY) {
      console.error("Contact form: WEB3FORMS_ACCESS_KEY is empty in src/constants/site.js.");
      setStatus({ type: "error", message: SEND_ERROR_MESSAGE });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nouveau message de ${form.name.trim()} via le site`,
          from_name: "Site Artifecta",
          name: form.name.trim(),
          email: form.email.trim(),
          "Type de projet": form.projectType,
          message: form.message.trim(),
          botcheck: form.botcheck,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.success) {
        // Web3Forms answers in English, so keep its reason in the console and show ours.
        console.error("Contact form failed:", payload.message || payload.body?.message || response.status);
        setStatus({ type: "error", message: SEND_ERROR_MESSAGE });
        return;
      }

      setStatus({ type: "success", message: "Merci, votre message a bien été envoyé." });
      setForm(initialForm);
    } catch {
      // Network failures surface browser-generated (English) messages, so show ours instead.
      setStatus({ type: "error", message: SEND_ERROR_MESSAGE });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="w-full px-8 py-24" style={{ background: "#142638" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-unbounded font-bold mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#a9c2d8" }}
            >
              Contact
            </h2>
            <p
              className="font-body mb-8"
              style={{
                color: "#a9c2d8",
                opacity: 0.8,
                fontSize: "1.05rem",
                lineHeight: 1.6,
              }}
            >
              «&nbsp;Les grandes choses dans les affaires ne sont jamais accomplies
              par une seule personne. Elles sont l’œuvre d’une équipe.&nbsp;»
              <br />
              Construisons ensemble quelque chose d’extraordinaire.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <input
                className="contact-input"
                type="text"
                name="name"
                placeholder="Votre nom"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
              <input
                className="contact-input"
                type="email"
                name="email"
                placeholder="Votre adresse e-mail"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
              <div className="relative">
                <select
                  className="contact-input appearance-none w-full"
                  name="projectType"
                  value={form.projectType}
                  onChange={(event) => updateField("projectType", event.target.value)}
                  style={{
                    color: form.projectType ? "#ffffff" : "rgba(255,255,255,0.4)",
                  }}
                  required
                >
                  <option value="" disabled style={{ color: "#142638" }}>
                    Type de projet
                  </option>
                  {projectTypes.map((projectType) => (
                    <option
                      key={projectType}
                      value={projectType}
                      style={{ color: "#142638" }}
                    >
                      {projectType}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L7 7L13 1"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <textarea
                className="contact-input"
                name="message"
                placeholder="Votre message"
                rows={4}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                style={{ resize: "vertical" }}
                required
              />
              <input
                type="checkbox"
                name="botcheck"
                checked={form.botcheck}
                onChange={(event) => updateField("botcheck", event.target.checked)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: "none" }}
              />

              {status.message ? (
                <p
                  className="font-body text-sm"
                  style={{
                    color: status.type === "error" ? "#ffb3b3" : "#d1f0dc",
                  }}
                >
                  {status.message}
                </p>
              ) : null}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="font-body font-semibold w-full py-4 rounded-full mt-2"
                style={{
                  background:
                    status.type === "success" ? "#4e6c80" : "#a9c2d8",
                  color: "#142638",
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: isSubmitting ? "wait" : "pointer",
                  letterSpacing: "0.04em",
                  opacity: isSubmitting ? 0.85 : 1,
                }}
                whileHover={{ scale: isSubmitting ? 1 : 1.03, boxShadow: "0 6px 28px rgba(169,194,216,0.3)" }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {isSubmitting
                  ? "Envoi en cours…"
                  : status.type === "success"
                    ? "Message envoyé ✓"
                    : "Travaillons ensemble →"}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            className="flex-1 w-full hidden md:flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
          >
            <img
              src={CONTACT_IMAGE_SRC}
              alt="Illustration de contact"
              className="w-full h-auto object-cover rounded-3xl shadow-2xl"
              style={{ maxHeight: "520px" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
