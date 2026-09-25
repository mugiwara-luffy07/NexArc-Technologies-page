import { clsx } from "clsx";

/**
 * Signature hover detail: an arc hugs the tile's rounded top-left corner, just outside it.
 * Geometry is in real pixels so it stays concentric with the 16px card radius at any tile size:
 * the svg sits 8px outside the corner, so the corner's centre is at (24,24) and a 22px radius
 * leaves an even ~5px gap from the edge. Place it with `-left-2 -top-2` on a `relative` wrapper.
 * Parent needs the `group` class. Triggered by hover (pointer devices) and focus-visible.
 */
export function CornerArc({ className }: { className?: string }) {
  return (
    <svg aria-hidden width="40" height="40" viewBox="0 0 40 40" className={clsx("pointer-events-none absolute overflow-visible", className)}>
      <path
        d="M 2 24 A 22 22 0 0 1 24 2"
        pathLength={1}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className={clsx(
          // opacity hides the round cap, which would otherwise show as a dot at offset 1
          "stroke-accent opacity-0 [stroke-dasharray:1] [stroke-dashoffset:1]",
          "transition-[stroke-dashoffset,opacity] duration-700 ease-[var(--ease-arc)]",
          "group-focus-visible:opacity-100 group-focus-visible:[stroke-dashoffset:0]",
          "[@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:[stroke-dashoffset:0]",
          // touch screens have no hover: show the arc drawn
          "[@media(hover:none)]:opacity-100 [@media(hover:none)]:[stroke-dashoffset:0]",
        )}
      />
    </svg>
  );
}
