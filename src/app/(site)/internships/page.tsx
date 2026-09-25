import { PageIntro } from "@/components/content/PageIntro";
import { InternshipForm } from "@/components/forms/InternshipForm";
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
  { verb: "Apply", text: "Send the form below with a link to your work." },
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

      <section className="border-t border-line">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg">Tracks</h2>
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
    </>
  );
}
