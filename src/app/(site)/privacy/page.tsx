import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Privacy policy", description: `How ${site.name} collects, uses and protects your information.`, path: "/privacy" });

// Written for the Digital Personal Data Protection Act, 2023 and the IT Rules, 2011.
// Not legal advice: have a lawyer review it if the business grows or starts processing more data.
export default function PrivacyPage() {
  const { legal } = site;
  const officer = legal.grievanceOfficer;
  return (
    <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
      <div className="max-w-[68ch]">
        <h1 className="text-display-lg">Privacy policy</h1>
        <p className="mt-3 text-subtle">Last updated: 26 September 2026</p>
        <div className="prose-nexarc mt-10">
          <p>
            This policy explains what personal data {site.name} (&ldquo;NexArc&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), {legal.entity} and
            registered under Udyam as {legal.udyam}, collects through nexarctechnologies.com, why, and what you can ask us to do with it. We collect only
            what we need to reply to you.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Project enquiries (Start a project):</strong> your name, email, phone or WhatsApp number, business name, and the project details,
              budget range and timeline you choose to share.
            </li>
            <li>
              <strong>Product waitlist:</strong> your email and, if you pick one, the product you are interested in.
            </li>
            <li>
              <strong>Internship applications:</strong> your name, email, phone, college, portfolio link, what you write about your work, and an optional
              resume (PDF).
            </li>
            <li>
              <strong>Website analytics:</strong> anonymous page view statistics through Vercel Analytics. It uses no cookies and does not identify you.
            </li>
          </ul>
          <p>We do not collect payment details, government ID numbers or sensitive personal data through this website.</p>

          <h2>Why we use it</h2>
          <p>
            Only to reply to your enquiry and prepare a proposal, to tell you once when a waitlisted product launches, or to assess your internship
            application. We process this data because you give consent when you submit a form. We do not sell or rent your data, and we do not add you
            to marketing lists without asking.
          </p>

          <h2>Who processes it for us</h2>
          <ul>
            <li>
              <strong>Supabase</strong> stores form submissions and resumes in its Mumbai, India region.
            </li>
            <li>
              <strong>Resend</strong> delivers our emails (the notification to us and the confirmation to you) from its Tokyo, Japan region.
            </li>
            <li>
              <strong>Vercel</strong> hosts this website and provides the anonymous analytics.
            </li>
            <li>
              <strong>Google Workspace</strong> hosts our email inbox, where enquiry notifications arrive.
            </li>
          </ul>
          <p>
            These providers process data only on our instructions. Some processing happens outside India, which the DPDP Act permits except to
            countries the Government of India restricts.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            This site does not use advertising or tracking cookies. It stores one setting in your browser, your light or dark theme choice, so the site
            remembers it. Clicking a WhatsApp link opens WhatsApp, which has its own privacy policy.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries and internship applications are kept for up to 24 months, or until you ask us to delete them. Waitlist emails are deleted once the
            product launches or when you ask us to remove you.
          </p>

          <h2>How we protect it</h2>
          <p>
            Data travels over encrypted connections (HTTPS). Our database is private, and only our own server can read or write submissions. Resumes are
            kept in private storage that is not publicly accessible.
          </p>

          <h2>Your rights</h2>
          <p>Under the Digital Personal Data Protection Act, 2023 you can ask us to:</p>
          <ul>
            <li>tell you what personal data we hold about you and how we use it;</li>
            <li>correct or complete it;</li>
            <li>delete it, or withdraw your consent at any time;</li>
            <li>nominate another person to exercise these rights on your behalf.</li>
          </ul>
          <p>
            Email the Grievance Officer below and we will respond within 30 days. If you are not satisfied with our response, you can complain to the
            Data Protection Board of India.
          </p>

          <h2>Children</h2>
          <p>This website is not meant for children under 18, and we do not knowingly collect their data.</p>

          <h2>Grievance Officer</h2>
          <p>
            {officer.name}, {officer.role}
            <br />
            {site.name}, {legal.city}, Tamil Nadu, India
            <br />
            Email: <a href={`mailto:${officer.email}`}>{officer.email}</a>
            <br />
            Phone: {site.phone}
          </p>

          <h2>Changes to this policy</h2>
          <p>If we change how we use personal data, we will update this page and the date at the top.</p>
        </div>
      </div>
    </section>
  );
}
