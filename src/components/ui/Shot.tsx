import Image from "next/image";
import { clsx } from "clsx";

/**
 * Project screenshot frame. When no image exists yet it renders an explicit,
 * labelled slot instead of a fake div-built UI.
 */
export function Shot({
  src,
  alt,
  ratio = "16/10",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className,
  slotLabel,
}: {
  src?: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  slotLabel?: string;
}) {
  return (
    <div
      className={clsx("relative overflow-hidden rounded-[var(--radius-card)] bg-canvas ring-1 ring-line", className)}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      ) : (
        <div className="absolute inset-0 flex items-end p-5">
          <p className="font-mono text-xs text-subtle">{slotLabel ?? `Screenshot slot: ${alt}`}</p>
        </div>
      )}
    </div>
  );
}
