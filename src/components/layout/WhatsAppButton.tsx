"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/** Floating WhatsApp shortcut. Hidden on /contact, where it is already listed and forms own the bottom edge. */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact") || pathname.startsWith("/internships")) return null;

  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp us"
      className="fixed z-30 inline-flex size-13 items-center justify-center rounded-full bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink shadow-[0_10px_30px_-10px_rgb(20_20_22/0.5)] ring-1 ring-white/10 transition-transform duration-300 ease-[var(--ease-arc)] hover:-translate-y-0.5 active:scale-95 sm:size-14"
      style={{
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <WhatsappLogo size={26} weight="regular" aria-hidden />
    </a>
  );
}
