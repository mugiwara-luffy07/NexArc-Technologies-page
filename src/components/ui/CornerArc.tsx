import { clsx } from "clsx";
import { ARC_PATH } from "@/components/brand/Mark";

/**
 * Signature hover detail: the mark's arc traces the top-left corner of a tile.
 * Parent needs the `group` class. Triggered by hover (pointer devices) and focus-visible.
 */
export function CornerArc({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="10 10 30 30"
      className={clsx("pointer-events-none absolute size-12 sm:size-14", className)}
    >
      <path
        d={ARC_PATH}
        pathLength={1}
        fill="none"
        strokeWidth="5"
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
