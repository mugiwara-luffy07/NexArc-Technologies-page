"use client";

import { LazyMotion, domAnimation, m as motion, useReducedMotion } from "motion/react";
import { ARC_PATH } from "./Mark";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The one orchestrated motion moment on the site: the arc draws itself,
 * then the dot lands. Static under prefers-reduced-motion.
 */
export function HeroArc({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="NexArc corner arc mark">
      <motion.rect
        width="48"
        height="48"
        rx="12"
        className="fill-brand-ink dark:fill-brand-paper"
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "24px 24px" }}
        transition={{ duration: 0.7, ease }}
      />
      <motion.path
        d={ARC_PATH}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        className="stroke-brand-orange dark:stroke-brand-orange-dark"
        // opacity guards against round caps rendering as dots at length 0
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 1.1, delay: 0.35, ease }, opacity: { duration: 0.01, delay: 0.35 } }}
      />
      <motion.circle
        cx="35"
        cy="35"
        r="4.5"
        className="fill-brand-paper dark:fill-brand-ink"
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.25 }}
      />
    </svg>
    </LazyMotion>
  );
}
