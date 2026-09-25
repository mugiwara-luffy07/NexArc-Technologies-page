import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { ARC_PATH } from "@/components/brand/Mark";
import { CTA_LABEL, site } from "@/lib/site";

/** The one deliberate dark colour block per page. Fixed brand ink in both themes. */
export function CtaBand({
  title = "Have a project in mind?",
  text = "Tell us what you need. We reply within one working day with next steps and a rough budget range.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="gutter mx-auto max-w-[1320px] pb-14 md:pb-20">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-brand-ink px-6 py-10 text-brand-paper ring-1 ring-white/10 sm:px-10 md:px-12 md:py-12">
        {/* faint watermark mark; its arc draws in as the band scrolls into view (.cta-arc in globals.css) */}
        <svg aria-hidden viewBox="0 0 48 48" className="absolute -right-10 -bottom-10 size-44 opacity-[0.13] md:size-64">
          <rect width="48" height="48" rx="12" fill="#F7F7F5" />
          <path d={ARC_PATH} pathLength={1} fill="none" stroke="#FF7E45" strokeWidth="7" strokeLinecap="round" className="cta-arc" />
          <circle cx="35" cy="35" r="4.5" fill="#141416" className="cta-dot" />
        </svg>
        <div className="relative max-w-2xl">
          <h2 className="text-display-lg text-balance">{title}</h2>
          <p className="mt-4 max-w-[48ch] text-lg text-white/75">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="inverse" size="lg">
              {CTA_LABEL}
            </ButtonLink>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("inverseOutline", "lg")}
            >
              <WhatsappLogo size={20} aria-hidden />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
