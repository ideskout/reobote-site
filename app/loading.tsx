export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="h-4 w-40 bg-white/10" />
      <div className="mt-6 h-12 w-80 max-w-full bg-white/10" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="aspect-[4/3] bg-white/5" />
        <div className="aspect-[4/3] bg-white/5" />
        <div className="aspect-[4/3] bg-white/5" />
      </div>
    </div>
  );
}
