import Image from "next/image";

export function BrokerPortrait({
  priority = false,
  badge,
  floating,
  className = "",
}: {
  priority?: boolean;
  badge?: string;
  floating?: { kicker: string; label: string };
  className?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div className="rounded-lg border bg-card p-3 shadow-sm">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md border">
          <Image
            src="/brand/elisangela.jpg"
            alt="Elisangela Dias, corretora responsável pela Reobote"
            fill
            priority={priority}
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="object-cover object-[center_38%]"
          />
        </div>
      </div>
      {floating ? (
        <figcaption className="absolute bottom-8 left-8 rounded-lg border bg-card px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold text-primary">{floating.kicker}</p>
          <p className="text-sm text-foreground">{floating.label}</p>
        </figcaption>
      ) : badge ? (
        <figcaption className="absolute bottom-8 left-8 rounded-lg border bg-card px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-foreground">{badge}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
