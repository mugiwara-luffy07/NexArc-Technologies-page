import {
  siFigma,
  siFlutter,
  siNextdotjs,
  siPostgresql,
  siRazorpay,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

// Tools we actually ship with. Monochrome so the strip reads as texture, not a logo wall.
const tools = [siNextdotjs, siReact, siTypescript, siTailwindcss, siSupabase, siPostgresql, siFlutter, siRazorpay, siFigma, siVercel];

export function ToolStrip() {
  return (
    <section aria-label="Tools we build with" className="border-y border-line">
      <div className="gutter mx-auto flex max-w-[1320px] flex-col gap-4 py-6 md:flex-row md:items-center md:gap-10">
        <p className="shrink-0 text-sm text-subtle">Built with</p>
        <ul className="flex flex-wrap items-center gap-x-7 gap-y-4 sm:gap-x-9">
          {tools.map((t) => (
            <li key={t.slug} title={t.title} className="text-subtle transition-colors hover:text-ink">
              <svg viewBox="0 0 24 24" className="size-5 sm:size-[22px]" fill="currentColor" role="img" aria-label={t.title}>
                <path d={t.path} />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
