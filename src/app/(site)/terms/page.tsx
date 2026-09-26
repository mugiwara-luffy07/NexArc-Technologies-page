import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Terms of use", description: `Terms for using the ${site.name} website.`, path: "/terms" });

// Not legal advice: have a lawyer review it if the business grows. Client work is governed by each project agreement.
export default function TermsPage() {
  const { legal } = site;
  return (
    <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
      <div className="max-w-[68ch]">
        <h1 className="text-display-lg">Terms of use</h1>
        <p className="mt-3 text-subtle">Last updated: 26 September 2026</p>
        <div className="prose-nexarc mt-10">
          <p>
            This website is operated by {site.name}, {legal.entity}, registered under Udyam as {legal.udyam}. By using this website you agree to these
            terms. If you do not agree, please do not use the site.
          </p>

          <h2>Using this website</h2>
          <p>
            You may browse the site and contact us through it. Please do not misuse it, for example by sending spam through our forms, trying to access
            parts of the site that are not public, or interfering with how it works.
          </p>

          <h2>Content and brand</h2>
          <p>
            The text, design, the NexArc name, logo and mark, and the images on this site belong to {site.name}, or to clients who gave us permission to
            show their work. Please do not copy or reuse them without written permission.
          </p>

          <h2>Information on this site</h2>
          <p>
            We keep the information here accurate, but it is general and may change without notice. Prices, timelines and scope for any project are
            confirmed only in a written proposal or agreement.
          </p>

          <h2>Client projects</h2>
          <p>Work we do for clients is covered by a separate written project agreement. If that agreement and these terms differ, the agreement applies.</p>

          <h2>Links to other websites</h2>
          <p>Links to other websites, including client sites, are provided for convenience. We are not responsible for their content or practices.</p>

          <h2>Liability</h2>
          <p>
            This website is provided as it is. To the extent the law allows, {site.name} is not liable for any loss arising from using it or relying on
            its general information.
          </p>

          <h2>Privacy</h2>
          <p>
            How we handle your personal data is explained in our <a href="/privacy">privacy policy</a>.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of India. The courts at {legal.city}, Tamil Nadu have exclusive jurisdiction.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a> or {site.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}
