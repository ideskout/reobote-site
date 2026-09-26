export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 34 16 18l6 8 7-10 15 18"
        stroke="#e6c97a"
        strokeWidth="1.4"
      />
      <path d="M8 34 24 14 40 34" stroke="#c9a24a" strokeWidth="1.6" />
      <path d="M15 34.5V43h18v-8.5" stroke="#c9a24a" strokeWidth="1.6" />
      <path d="M21.5 43V36h5v7" stroke="#e6c97a" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({
  withWordmark = true,
  className = "",
}: {
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark />
      {withWordmark ? (
        <span className="font-serif text-[1.35rem] leading-none tracking-[0.28em] text-ivory">
          REOBOTE
        </span>
      ) : null}
    </span>
  );
}
