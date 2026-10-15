import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

const formatter = new Intl.NumberFormat("fr-FR");

// Counts from 0 to `to` the first time it scrolls into view. An invisible copy of the final
// value reserves the width, so nothing around it moves while it counts.
export function CountUp({ to, suffix = "", duration = 1.6, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);
  const format = (n) => `${formatter.format(Math.round(n))}${suffix}`;

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setValue(to);
      return undefined;
    }
    const controls = animate(0, to, { duration, delay, ease: EASE, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduceMotion, to, duration, delay]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block", fontVariantNumeric: "tabular-nums" }}>
      <span className="sr-only">{format(to)}</span>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{format(to)}</span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>{format(value)}</span>
    </span>
  );
}

// Endless horizontal ticker: two identical lists slide by their own width, so the loop is seamless.
export function Marquee({ children, duration = 40, label }) {
  return (
    <div className="marquee" style={{ "--marquee-duration": `${duration}s` }}>
      <ul className="marquee-copy" aria-label={label}>{children}</ul>
      <ul className="marquee-copy" aria-hidden="true">{children}</ul>
    </div>
  );
}
