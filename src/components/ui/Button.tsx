import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "inverse" | "inverseOutline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] font-medium " +
  "transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-arc)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  // ink button, hover lands on the brand orange with ink text (6.4:1)
  primary: "bg-btn-bg text-btn-fg hover:bg-accent hover:text-on-accent",
  secondary: "border border-line bg-transparent text-ink hover:border-ink",
  // for use on the fixed dark CTA band regardless of theme
  inverse: "bg-brand-paper text-brand-ink hover:bg-brand-orange-dark",
  inverseOutline: "border border-white/30 bg-transparent text-brand-paper hover:border-brand-paper",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-[0.95rem]",
  lg: "h-12 px-5 text-base sm:h-13 sm:px-6",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return clsx(base, variants[variant], sizes[size], className);
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode };

export function ButtonLink({ variant, size, className, ...props }: LinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: BtnProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}
