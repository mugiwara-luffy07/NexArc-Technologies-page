import { clsx } from "clsx";

/** Corner Arc geometry, shared by the mark and every arc motif on the site. */
export const ARC_PATH = "M13 36 A23 23 0 0 1 36 13";

type Tone = "ink" | "paper" | "auto";

const tones: Record<Tone, { tile: string; arc: string; dot: string }> = {
  ink: { tile: "#141416", arc: "#FF6A2B", dot: "#F7F7F5" },
  paper: { tile: "#F7F7F5", arc: "#FF7E45", dot: "#141416" },
  // follows the page theme: ink tile on light pages, paper tile on dark
  auto: { tile: "var(--ink)", arc: "var(--accent)", dot: "var(--paper)" },
};

export function Mark({
  tone = "auto",
  className,
  title,
}: {
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const c = tones[tone];
  return (
    <svg
      viewBox="0 0 48 48"
      className={clsx("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="48" height="48" rx="12" fill={c.tile} />
      <path d={ARC_PATH} fill="none" stroke={c.arc} strokeWidth="7" strokeLinecap="round" />
      <circle cx="35" cy="35" r="4.5" fill={c.dot} />
    </svg>
  );
}
