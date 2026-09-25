import type { ReactNode } from "react";

/**
 * Enter-on-scroll for the work grid only. CSS scroll-driven animation (see .reveal in globals.css):
 * no JavaScript, and browsers without support simply show the content.
 */
export function Reveal({ children, className }: { children: ReactNode; index?: number; className?: string }) {
  return <div className={`reveal ${className ?? ""}`}>{children}</div>;
}
