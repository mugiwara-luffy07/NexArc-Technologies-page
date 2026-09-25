import { ARC_PATH } from "./Mark";

/**
 * The one orchestrated motion moment on the site: the tile settles, the arc draws itself,
 * then the dot lands. Pure CSS (see .hero-arc-* in globals.css), so it costs no JavaScript;
 * the global reduced-motion rule collapses it to the final frame.
 */
export function HeroArc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="NexArc corner arc mark">
      <rect width="48" height="48" rx="12" className="hero-arc-tile fill-brand-ink dark:fill-brand-paper" />
      <path
        d={ARC_PATH}
        pathLength={1}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        className="hero-arc-path stroke-brand-orange dark:stroke-brand-orange-dark"
      />
      <circle cx="35" cy="35" r="4.5" className="hero-arc-dot fill-brand-paper dark:fill-brand-ink" />
    </svg>
  );
}
