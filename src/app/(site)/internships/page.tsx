import type { ReactNode } from "react";
import { PageIntro } from "@/components/content/PageIntro";
import { InternshipForm } from "@/components/forms/InternshipForm";
import { NotifyForm } from "@/components/forms/NotifyForm";
import { HeroArc } from "@/components/brand/HeroArc";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { INTERNSHIP_ROLE } from "@/lib/validators";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Full-Stack Engineer Internship",
  description:
    "NexArc Technologies is hiring 3 Full-Stack Engineer Interns in Tamil Nadu. A 12 week hybrid internship on real projects with Next.js, React, TypeScript, Node.js and Supabase. Apply with your resume.",
  path: "/internships",
});

const facts = [
  { label: "Openings", value: "3" },
  { label: "Duration", value: "12 weeks", note: "or project completion, whichever is earlier" },
  { label: "Mode", value: "Hybrid", note: "Online + Offline" },
  { label: "Type", value: "Project-based" },
  { label: "Stipend", value: "Unpaid" },
] satisfies { label: string; value: string; note?: string }[];

const mandatory = [
  "Next.js and React.js",
  "JavaScript and TypeScript",
  "Node.js and backend development",
  "REST API development",
  "PostgreSQL / SQL / Supabase",
  "Database design and authentication",
  "Git and GitHub",
  "Familiarity with Claude Code, Cursor or other AI coding tools",
];

const preferred = ["Tailwind CSS", "Automated testing and Playwright", "Third-party API integrations", "Deployment and performance optimisation"];

const lookingFor = [
  "Strong problem-solving and logical thinking.",
  "Practical full-stack development knowledge.",
  "Experience building at least one application.",
  "Ability to debug and understand generated code.",
  "Independent thinking and ownership.",
  "Good communication and collaboration.",
];

const responsibilities = [
  "Understand requirements and technical specifications.",
  "Develop frontend and backend application features.",
  "Build APIs and database operations.",
  "Use modern AI coding tools effectively.",
  "Review, debug and validate generated code.",
  "Test and improve application functionality.",
  "Collaborate through GitHub and pull requests.",
  "Maintain code quality and technical documentation.",
];

const howWeWork = [
  "Clearly defined tasks and deliverables.",
  "GitHub-based collaboration.",
  "Technical guidance and code reviews.",
  "Regular progress updates.",
  "Weekly demonstrations and feedback.",
  "Work planned around your communicated academic commitments.",
];

const gains = [
  "Hands-on experience with real-world software projects.",
  "Opportunity to build custom software applications.",
  "Practical full-stack development experience.",
  "Exposure to modern AI engineering tools.",
  "Mentorship from the founder and technical lead.",
  "Professional development workflows and collaboration.",
  "Internship certificate on successful completion.",
];

const selection = [
  { verb: "Apply", text: "Application and project portfolio screening." },
  { verb: "Assess", text: "A practical technical assessment." },
  { verb: "Walk through", text: "Code walkthrough and technical discussion." },
  { verb: "Join", text: "Final selection and onboarding." },
];

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-5 py-10 md:py-12 lg:grid-cols-12 lg:gap-8">
      <h2 className="font-display text-[clamp(1.3rem,1.15rem+0.5vw,1.6rem)] leading-tight font-bold tracking-tight lg:col-span-4">{title}</h2>
      <div className="lg:col-span-8">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-muted">
          <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Closed() {
  return (
    <section id="apply" className="gutter mx-auto max-w-[1320px] scroll-mt-24 pb-14 md:pb-20">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-7 ring-1 ring-line sm:p-10">
        <HeroArc className="pointer-events-none absolute -right-6 -bottom-6 hidden w-40 opacity-90 md:block lg:w-48" />
        <div className="relative max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-sm font-medium">
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
            Stay tuned
          </p>
          <h2 className="text-display-lg mt-5">
            Internships opening <span className="text-accent-text">soon</span>
          </h2>
          <p className="mt-3 max-w-[48ch] text-muted">
            We will announce our next internship openings here. Leave your email to hear first when applications open.
          </p>
          <div className="mt-7">
            <NotifyForm topic="Internship openings" success="Done. We will email you when internship applications open." />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function InternshipsPage() {
  if (!site.internshipsOpen) {
    return (
      <>
        <PageIntro title="Learn by shipping real software">
          Our interns work on live client projects, not practice tasks. You get code reviews, real deadlines and work you can show.
        </PageIntro>
        <Closed />
      </>
    );
  }

  return (
    <>
      <PageIntro title={INTERNSHIP_ROLE}>
        A 12 week hybrid internship, online and offline. Build real software across frontend, backend, databases and APIs, with features you own from spec to ship.
      </PageIntro>

      {/* Role card: status, key facts, apply */}
      <section className="gutter mx-auto max-w-[1320px] pb-6">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-7 ring-1 ring-line sm:p-10">
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-sm font-medium">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Hiring now · Internship, Engineering
            </p>
            <ButtonLink href="#apply" size="lg">
              Apply now
            </ButtonLink>
          </div>
          <dl className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-xs text-subtle">{f.label}</dt>
                <dd className="mt-1.5 font-display text-lg font-bold tracking-tight">{f.value}</dd>
                {"note" in f && f.note && <dd className="mt-1 max-w-[22ch] text-sm text-subtle">{f.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="gutter mx-auto max-w-[1320px]">
        <div className="divide-y divide-line">
          <Row title="About NexArc">
            <p className="max-w-[60ch] text-lg">
              NexArc Technologies builds custom software, business applications and intelligent automation systems that solve real business problems.
            </p>
            <p className="mt-3 max-w-[60ch] text-muted">We combine modern technologies and practical engineering to create useful, scalable and maintainable software.</p>
          </Row>
          <Row title="The opportunity">
            <p className="max-w-[60ch] text-muted">
              Selected interns work on real software projects, build custom applications, improve existing systems and get hands-on experience with
              modern engineering workflows.
            </p>
            <p className="mt-3 max-w-[60ch]">This is not a conventional internship of tutorials, college assignments or basic UI work.</p>
          </Row>
          <Row title="The role">
            <p className="max-w-[60ch] text-muted">
              All three interns join as Full-Stack Engineer Interns. You will work across frontend, backend, databases and APIs, with individual
              feature ownership and collaborative development.
            </p>
          </Row>
          <Row title="Technical requirements">
            <p className="mb-4 text-sm font-medium text-accent-text">Mandatory skills</p>
            <List items={mandatory} />
            <p className="mt-8 mb-3 text-sm font-medium text-subtle">Preferred skills</p>
            <ul className="flex flex-wrap gap-2">
              {preferred.map((p) => (
                <li key={p} className="rounded-full bg-canvas px-3.5 py-1.5 text-sm">
                  {p}
                </li>
              ))}
            </ul>
          </Row>
          <Row title="What we are looking for">
            <List items={lookingFor} />
          </Row>
          <Row title="Key responsibilities">
            <List items={responsibilities} />
          </Row>
          <Row title="Engineering standards">
            <p className="max-w-[60ch] text-muted">
              AI is part of our engineering workflow, but it never replaces engineering judgement. Interns must understand, review, debug and test
              everything they submit.
            </p>
            <blockquote className="mt-6 rounded-[var(--radius-card)] border-l-4 border-accent bg-canvas p-6 font-display text-[clamp(1.15rem,1.05rem+0.5vw,1.45rem)] leading-snug font-bold tracking-tight text-balance">
              Do not just write code. Understand the problem, engineer the solution and deliver it wisely.
            </blockquote>
          </Row>
          <Row title="How we work">
            <List items={howWeWork} />
          </Row>
          <Row title="What you will gain">
            <List items={gains} />
          </Row>
        </div>
      </section>

      <section className="mt-6 bg-canvas">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg">Selection process</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {selection.map((s, i) => (
              <li key={s.verb} className={i === 0 ? "border-t-2 border-accent pt-5" : "border-t-2 border-ink pt-5"}>
                <h3 className="font-display text-xl font-bold tracking-tight">{s.verb}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-[60ch] text-muted">
            Candidates are evaluated on practical skills, problem-solving, debugging and their understanding of the code they submit.
          </p>
        </div>
      </section>

      <section id="apply" className="gutter mx-auto max-w-[1320px] scroll-mt-24 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-display-lg">
              Your Next Arc <span className="text-accent-text">Starts at NexArc</span>
            </h2>
            <p className="mt-4 max-w-[36ch] text-muted">
              Send your details, your GitHub and your resume. Shortlisted candidates get the technical assessment by email.
            </p>
            <p className="mt-6 text-sm text-muted">
              Questions? Email{" "}
              <a href={`mailto:${site.email}`} className="break-all text-ink underline decoration-accent underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
          <div className="lg:col-span-8">
            <InternshipForm />
          </div>
        </div>
      </section>
    </>
  );
}
