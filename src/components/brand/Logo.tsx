import Link from "next/link";
import { clsx } from "clsx";
import { Mark } from "./Mark";

export function Logo({ className, tone = "auto" }: { className?: string; tone?: "auto" | "ink" | "paper" }) {
  return (
    <Link
      href="/"
      className={clsx("group inline-flex items-center gap-2.5 rounded-[var(--radius-control)]", className)}
      aria-label="NexArc Technologies, home"
    >
      <Mark tone={tone} className="size-8 transition-transform duration-500 ease-[var(--ease-arc)] group-hover:-rotate-6" />
      <span className="font-display text-[1.35rem] leading-none font-bold tracking-[-0.02em]">NexArc</span>
    </Link>
  );
}
