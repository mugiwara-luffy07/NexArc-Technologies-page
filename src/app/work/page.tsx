import { PageIntro } from "@/components/content/PageIntro";
import { WorkTile } from "@/components/sections/WorkTile";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { getWork } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Work",
  description: "Websites, CRMs and platforms NexArc Technologies has designed and built for real businesses.",
  path: "/work",
});

export default function WorkPage() {
  const work = getWork();
  return (
    <>
      <PageIntro title="Work that is live and in daily use">
        Every project here is running for a real business or organisation. Open one to see the problem, what we built and how.
      </PageIntro>
      <section className="gutter mx-auto max-w-[1320px] pb-16 md:pb-24">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {work.length === 1 ? (
            <Reveal className="md:col-span-2">
              <WorkTile item={work[0]} headingLevel="h2" size="lg" ratio="16/9" sizes="(min-width: 1320px) 1240px, 100vw" priority />
            </Reveal>
          ) : (
            work.map((w, i) => (
              <Reveal key={w.slug} index={i % 2} className={i % 2 === 1 ? "md:mt-20" : ""}>
                <WorkTile item={w} headingLevel="h2" size="lg" ratio="16/11" sizes="(min-width: 768px) 50vw, 100vw" priority={i < 2} />
              </Reveal>
            ))
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
