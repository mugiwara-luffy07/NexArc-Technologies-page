"use client";

import { LazyMotion, domAnimation, m as motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Enter-on-scroll for the work grid only. Static under reduced motion. */
export function Reveal({ children, index = 0, className }: { children: ReactNode; index?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
    </LazyMotion>
  );
}
