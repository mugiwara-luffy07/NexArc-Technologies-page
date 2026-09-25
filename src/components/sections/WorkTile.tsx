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
}: {
  item: Work;
  ratio?: string;
  size?: "lg" | "md";
  sizes?: string;
  priority?: boolean;
}) {
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
          className="transition-transform duration-700 ease-[var(--ease-arc)] [@media(hover:hover)]:group-hover:scale-[0.985]"
        />
        <CornerArc className="-left-2 -top-2" />
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        <p className="font-mono text-xs text-subtle">{item.client}</p>
        <h3
          className={clsx(
            "font-display font-bold tracking-tight text-balance",
            size === "lg" ? "text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] leading-[1.12]" : "text-[1.3rem] leading-[1.18]",
          )}
        >
          {item.title}
        </h3>
        <p className="max-w-[52ch] text-muted">{item.summary}</p>
      </div>
    </Link>
  );
}
