import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Privacy policy", description: `How ${site.name} collects and uses your information.`, path: "/privacy" });

// TODO(legal): have this reviewed before launch (Digital Personal Data Protection Act, 2023)
export default function PrivacyPage() {
  return (
    <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
      <div className="max-w-[68ch]">
        <h1 className="text-display-lg">Privacy policy</h1>
        <p className="mt-3 text-subtle">Last updated: September 2026</p>
        <div className="prose-nexarc mt-10">
          <p>
            This policy explains what {site.name} (&ldquo;NexArc&rdquo;, &ldquo;we&rdquo;) collects through this website and how we use it. We collect
            only what we need to reply to you.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Project enquiries:</strong> your name, email, phone number, business name and the project details you share.
            </li>
            <li>
              <strong>Product waitlist:</strong> your email and the product you are interested in.
            </li>
            <li>
              <strong>Internship applications:</strong> your name, contact details, college, portfolio link, the text you write and an optional resume.
            </li>
            <li>
              <strong>Analytics:</strong> anonymous, cookie-free page view statistics through Vercel Analytics. We do not use advertising cookies.
            </li>
          </ul>
          <h2>Why we use it</h2>
          <p>
            To reply to your enquiry, prepare a proposal, tell you when a product launches, or assess your internship application. We do not sell or
            rent your information, and we do not add you to marketing lists without asking.
          </p>
          <h2>Where it is stored</h2>
          <p>
            Submissions are stored in our database (Supabase) and delivered to our inbox by our email provider (Resend). These providers process data on
            our behalf and may store it outside India.
          </p>
          <h2>How long we keep it</h2>
          <p>
            Enquiries and applications are kept for up to 24 months, or until you ask us to delete them. Waitlist emails are deleted once the product
            launches or when you unsubscribe.
          </p>
          <h2>Your rights</h2>
          <p>
            You can ask us to show, correct or delete the information we hold about you, or withdraw your consent at any time. Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond within 30 days.
          </p>
          <h2>Contact</h2>
          <p>
            {site.name}, {site.locality}. Email <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}
