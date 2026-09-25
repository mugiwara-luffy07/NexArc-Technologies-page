import { Mark } from "@/components/brand/Mark";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="gutter mx-auto flex max-w-[1320px] flex-col items-start gap-8 py-20 md:py-32">
      <Mark className="size-16" />
      <div>
        <h1 className="text-display-xl max-w-[14ch]">This page is off the arc.</h1>
        <p className="mt-5 max-w-[42ch] text-lg text-muted">The link may be old or mistyped. Try the home page or have a look at our work.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Go home
        </ButtonLink>
        <ButtonLink href="/work" variant="secondary" size="lg">
          See our work
        </ButtonLink>
      </div>
    </section>
  );
}
