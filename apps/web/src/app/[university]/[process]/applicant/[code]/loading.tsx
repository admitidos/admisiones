// Skeleton shown while the applicant result page streams — score hero + stat tiles,
// position/distribution bars and the two-column chart row.
export default function Loading() {
  return (
    <main className="animate-pulse" aria-hidden="true">
      <section className="px-5 pb-10 pt-7 sm:px-8 lg:px-12" style={{ background: "var(--hero-bg)" }}>
        <div className="mx-auto max-w-180">
          <div className="h-3 w-44 rounded bg-white/20" />
          <div className="mt-5 h-16 w-40 rounded bg-white/25 sm:h-20" />
          <div className="mt-4 h-4 w-2/3 rounded bg-white/15" />
          <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
        </div>
      </section>

      <div className="mx-auto max-w-180 px-5 pb-16 pt-7 sm:px-8 lg:px-12">
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg border border-border bg-surface" />
          ))}
        </div>

        <div className="mb-5 h-24 rounded-lg border border-border bg-surface" />
        <div className="mb-5 h-40 rounded-lg border border-border bg-surface" />

        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          <div className="h-56 rounded-lg border border-border bg-surface" />
          <div className="h-56 rounded-lg border border-border bg-surface" />
        </div>
      </div>
    </main>
  );
}
