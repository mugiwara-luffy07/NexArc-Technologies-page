import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/** Chrome for every normal page. The 404 lives outside this group so it can take the whole screen. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-[var(--radius-control)] bg-btn-bg px-4 py-3 text-btn-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
