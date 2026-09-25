import { ARC_PATH } from "./Mark";

/**
 * The one orchestrated motion moment on the site: the tile settles, the arc draws itself,
 * then the dot lands. Pure CSS (see .hero-arc-* in globals.css), so it costs no JavaScript;
 * the global reduced-motion rule collapses it to the final frame.
 */
export function HeroArc({ className, tone = "auto" }: { className?: string; tone?: "auto" | "paper" }) {
  // "paper": light tile for use on the fixed-dark 404, regardless of theme
  const tile = tone === "paper" ? "fill-brand-paper" : "fill-brand-ink dark:fill-brand-paper";
  const arc = tone === "paper" ? "stroke-brand-orange-dark" : "stroke-brand-orange dark:stroke-brand-orange-dark";
  const dot = tone === "paper" ? "fill-brand-ink" : "fill-brand-paper dark:fill-brand-ink";
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="NexArc corner arc mark">
      <rect width="48" height="48" rx="12" className={`hero-arc-tile ${tile}`} />
      <path
        d={ARC_PATH}
        pathLength={1}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        className={`hero-arc-path ${arc}`}
      />
      <circle cx="35" cy="35" r="4.5" className={`hero-arc-dot ${dot}`} />
    </svg>
  );
}
