import type { ReactNode } from "react";

/** Inner-page opener: left aligned, no eyebrow, one headline and one short line. */
export function PageIntro({ title, children, aside }: { title: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="gutter mx-auto max-w-[1320px] pb-12 pt-12 sm:pt-16 md:pb-16 md:pt-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h1 className="text-display-xl max-w-[18ch] text-balance">{title}</h1>
          {children && <div className="mt-6 max-w-[52ch] text-lg text-muted sm:text-xl">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-4">{aside}</div>}
      </div>
    </section>
  );
}
