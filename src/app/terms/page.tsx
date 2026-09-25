import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Terms of use", description: `Terms for using the ${site.name} website.`, path: "/terms" });

// TODO(legal): have this reviewed before launch. Client work is governed by each project agreement.
export default function TermsPage() {
  return (
    <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
      <div className="max-w-[68ch]">
        <h1 className="text-display-lg">Terms of use</h1>
        <p className="mt-3 text-subtle">Last updated: September 2026</p>
        <div className="prose-nexarc mt-10">
          <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
          <h2>Content</h2>
          <p>
            The text, design, logo and images on this site belong to {site.name} or to the clients who gave us permission to show their work. Please do
            not copy them without asking.
          </p>
          <h2>Information on this site</h2>
          <p>
            We keep the information here accurate, but it is general and may change. Prices, timelines and scope for any project are confirmed only in a
            written proposal or agreement.
          </p>
          <h2>Client projects</h2>
          <p>Work we do for clients is covered by a separate project agreement, which takes priority over these terms.</p>
          <h2>Links</h2>
          <p>Links to other websites, including client sites, are provided for convenience. We are not responsible for their content.</p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of India. Courts in Tamil Nadu have jurisdiction.</p>
          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
