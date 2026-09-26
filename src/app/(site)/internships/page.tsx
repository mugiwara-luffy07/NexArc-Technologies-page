import { PageIntro } from "@/components/content/PageIntro";
import { InternshipForm } from "@/components/forms/InternshipForm";
import { NotifyForm } from "@/components/forms/NotifyForm";
import { HeroArc } from "@/components/brand/HeroArc";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Internships",
  description: "Internships in web development, app development and UI/UX design at NexArc Technologies. Work on real client projects.",
  path: "/internships",
});

const tracks = [
  {
    name: "Web development",
    work: "Next.js, React and TypeScript on live client websites and platforms.",
    need: "You have built at least one web project on your own and can share the code.",
  },
  {
    name: "App development",
    work: "Flutter or React Native apps connected to real backends.",
    need: "You have built and run an app, even a small one, on a real phone.",
  },
  {
    name: "UI/UX design",
    work: "Flows, wireframes and interfaces in Figma for client projects.",
    need: "A portfolio or a few case studies that show how you think, not only final screens.",
  },
];

const steps = [
  { verb: "Apply", text: "Send an application with a link to your work." },
  { verb: "Small task", text: "A short, real-world task in your track, done in your own time." },
  { verb: "Chat", text: "A 30 minute call about your task and what you want to learn." },
  { verb: "Start", text: "Join a live project with a mentor reviewing your work." },
];

export default function InternshipsPage() {
  return (
    <>
      <PageIntro title="Learn by shipping real software">
        Our interns work on live client projects, not practice tasks. You get code reviews, real deadlines and work you can show.
      </PageIntro>

      {!site.internshipsOpen && (
        <section id="apply" className="gutter mx-auto max-w-[1320px] scroll-mt-24 pb-14 md:pb-20">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-7 ring-1 ring-line sm:p-10">
            <HeroArc className="pointer-events-none absolute -right-6 -bottom-6 hidden w-40 opacity-90 md:block lg:w-48" />
            <div className="relative max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-sm font-medium">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                Stay tuned
              </p>
              <h2 className="text-display-lg mt-5">Internships opening <span className="text-accent-text">soon</span></h2>
              <p className="mt-3 max-w-[48ch] text-muted">
                We will announce our next internship openings here. Leave your email to hear first when applications open.
              </p>
              <div className="mt-7">
                <NotifyForm topic="Internship openings" success="Done. We will email you when internship applications open." />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg">{site.internshipsOpen ? "Tracks" : "Tracks we will hire for"}</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {tracks.map((t) => (
              <div key={t.name} className="grid gap-3 py-7 md:grid-cols-12 md:gap-8">
                <h3 className="font-display text-2xl font-bold tracking-tight md:col-span-4">{t.name}</h3>
                <p className="text-ink md:col-span-4">{t.work}</p>
                <p className="text-muted md:col-span-4">{t.need}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.verb}>
                <h3 className="font-display text-xl font-bold tracking-tight">{s.verb}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          {/* TODO(content): add duration, stipend and remote/on-site details once decided */}
          <p className="mt-10 max-w-[60ch] text-muted">Duration, stipend and whether the role is remote or on-site are shared during the chat.</p>
        </div>
      </section>

      {site.internshipsOpen ? (
      <section id="apply" className="gutter mx-auto max-w-[1320px] scroll-mt-24 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-display-lg">Apply</h2>
            <p className="mt-4 max-w-[36ch] text-muted">We read every application and reply within two weeks.</p>
          </div>
          <div className="lg:col-span-8">
            <InternshipForm />
          </div>
        </div>
      </section>
      ) : null}
    </>
  );
}
