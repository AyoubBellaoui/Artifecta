import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

// Delay for the n-th card of a grid, capped so long lists don't keep the last cards waiting.
export function staggerDelay(index, step = 0.08, max = 6) {
  return Math.min(index, max) * step;
}

// Fades and lifts its content into view once. Only the y axis moves, so it reads the same in RTL.
// Each element watches its own visibility, so items added later (fetched data) still appear.
export function Reveal({ as = 'div', delay = 0, y = 24, amount = 0.2, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Counts from 0 to `to` the first time it scrolls into view. An invisible copy of the final value
// reserves the width, so the surrounding layout never moves.
export function CountUp({ to, format = (n) => String(Math.round(n)), duration = 1.4, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);

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
    <span ref={ref} className={`relative inline-block tabular-nums ${className}`}>
      <span className="sr-only">{format(to)}</span>
      <span aria-hidden="true" className="invisible">{format(to)}</span>
      <span aria-hidden="true" className="absolute inset-0">{format(value)}</span>
    </span>
  );
}

// Endless horizontal ticker. Items should carry their own end padding (pe-*) so the loop is seamless.
export function Marquee({ children, duration = 40, className = '' }) {
  return (
    <div className={`marquee ${className}`} style={{ '--marquee-duration': `${duration}s` }}>
      <ul className="marquee-copy flex shrink-0 items-center">{children}</ul>
      <ul className="marquee-copy flex shrink-0 items-center" aria-hidden="true">{children}</ul>
    </div>
  );
}
