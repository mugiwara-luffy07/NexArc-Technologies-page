import Link from "next/link";
import { clsx } from "clsx";
import type { Work } from "@/lib/content";
import { Shot } from "@/components/ui/Shot";
import { CornerArc } from "@/components/ui/CornerArc";

export function WorkTile({
  item,
  ratio = "16/10",
  size = "md",
  sizes,
  priority,
  headingLevel = "h3",
  compact = false,
}: {
  item: Work;
  ratio?: string;
  size?: "lg" | "md";
  sizes?: string;
  priority?: boolean;
  /** h2 when the tile sits directly under the page h1 */
  headingLevel?: "h2" | "h3";
  /** Small side-by-side card: screenshot left, text right (stacks on phones) */
  compact?: boolean;
}) {
  const Heading = headingLevel;
  if (compact) {
    return (
      <Link
        href={`/work/${item.slug}`}
        className="group relative grid max-w-4xl items-center gap-5 rounded-[var(--radius-card)] outline-offset-4 sm:grid-cols-[minmax(0,20rem)_1fr] sm:gap-8"
      >
        <div className="relative">
          <Shot
            src={item.cover}
            alt={`${item.client} project screenshot`}
            ratio="16/10"
            sizes="(min-width: 640px) 320px, 100vw"
            priority={priority}
           
          />
          <CornerArc className="-left-2 -top-2" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs text-subtle">{item.client}</p>
          <Heading className="font-display text-[1.3rem] leading-[1.18] font-bold tracking-tight text-balance group-hover:text-accent-text">
            {item.title}
          </Heading>
          <p className="max-w-[52ch] text-muted">{item.summary}</p>
        </div>
      </Link>
    );
  }
  const [w, h] = ratio.split("/").map(Number);
  const tall = h > w;
  return (
    <Link href={`/work/${item.slug}`} className="group relative block rounded-[var(--radius-card)] outline-offset-4">
      <div className="relative">
        <Shot
          src={tall ? (item.coverTall ?? item.cover) : item.cover}
          alt={`${item.client} project screenshot`}
          ratio={ratio}
          sizes={sizes}
          priority={priority}
         
        />
        <CornerArc className="-left-2 -top-2" />
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        <p className="font-mono text-xs text-subtle">{item.client}</p>
        <Heading
          className={clsx(
            "font-display font-bold tracking-tight text-balance",
            size === "lg" ? "text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] leading-[1.12]" : "text-[1.3rem] leading-[1.18]",
          )}
        >
          {item.title}
        </Heading>
        <p className="max-w-[52ch] text-muted">{item.summary}</p>
      </div>
    </Link>
  );
}
