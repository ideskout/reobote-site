import Image from "next/image";

export function LogoMark({ className = "h-16 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.png"
      alt=""
      width={640}
      height={512}
      className={`object-contain ${className}`}
    />
  );
}

export function Logo({
  className = "h-16 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt="Reobote Consultoria Imobiliária"
      width={640}
      height={512}
      priority={priority}
      className={`w-auto object-contain ${className}`}
    />
  );
}
