"use client";

import { Mark } from "@/components/brand/Mark";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="gutter mx-auto flex max-w-[1320px] flex-col items-start gap-8 py-20 md:py-32">
      <Mark className="size-16" />
      <div>
        <h1 className="text-display-lg max-w-[18ch]">Something broke on our side.</h1>
        <p className="mt-4 max-w-[46ch] text-lg text-muted">
          Please try again. If it keeps happening, email {site.email} and we will fix it.
        </p>
      </div>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}
