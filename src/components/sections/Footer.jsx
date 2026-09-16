import { LOGO_SRC, socialLinks } from "../../constants/site";

export default function Footer() {
  return (
    <footer className="w-full px-8 py-16" style={{ background: "#0a121c" }}>
      <div
        style={{ maxWidth: "1000px", margin: "0 auto" }}
        className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12"
      >
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <img
              src={LOGO_SRC}
              alt="Logo Artifecta"
              style={{
                width: 44,
                height: 44,
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
            <span className="font-unbounded text-sm font-bold tracking-widest text-white">
              ARTIFECTA
            </span>
          </div>
          <p
            className="font-body text-sm"
            style={{ color: "#a9c2d8", opacity: 0.7, maxWidth: "280px" }}
          >
            Nous concevons des expériences digitales évolutives, portées par le
            design, la technologie et l’IA.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-center md:text-left">
          <h4 className="font-unbounded text-white text-sm mb-3">Coordonnées</h4>
          <p className="font-body text-sm" style={{ color: "#a9c2d8", opacity: 0.7 }}>
            Casablanca, Maroc
          </p>
          <p className="font-body text-sm" style={{ color: "#a9c2d8", opacity: 0.7 }}>
            hello@artifecta.ma
          </p>
        </div>

        <div className="flex flex-col gap-2 text-center md:text-right">
          <h4 className="font-unbounded text-white text-sm mb-3">Réseaux sociaux</h4>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm transition-opacity hover:opacity-100"
              style={{ color: "#a9c2d8", opacity: 0.7, textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{ maxWidth: "1000px", margin: "60px auto 0" }}
        className="pt-8 border-t border-[rgba(169,194,216,0.1)] flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p className="font-body text-xs" style={{ color: "#a9c2d8", opacity: 0.4 }}>
          © 2026 Artifecta. Tous droits réservés.
        </p>
        <div className="flex gap-6 font-body text-xs">
          <a
            href="#"
            className="transition-opacity hover:opacity-100"
            style={{ color: "#a9c2d8", opacity: 0.4, textDecoration: "none" }}
          >
            Politique de confidentialité
          </a>
          <a
            href="#"
            className="transition-opacity hover:opacity-100"
            style={{ color: "#a9c2d8", opacity: 0.4, textDecoration: "none" }}
          >
            Conditions d’utilisation
          </a>
        </div>
      </div>
    </footer>
  );
}
