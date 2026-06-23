// Skeleton shown while the process page streams — gives instant feedback on a cache miss.
// Rough shape: indigo hero + filter chips + program rows.
export default function Loading() {
  return (
    <main className="animate-pulse" aria-hidden="true">
      <section className="px-5 pb-8 pt-6 sm:px-8 lg:px-12" style={{ background: "var(--hero-bg)" }}>
        <div className="mx-auto max-w-180">
          <div className="h-3 w-40 rounded bg-white/20" />
          <div className="mt-4 h-7 w-3/4 rounded bg-white/25 sm:h-9" />
          <div className="mt-5 flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-24 rounded-sm bg-white/10" />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-180 px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-16 rounded-full bg-border" />
          ))}
        </div>

        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg border border-border bg-surface" />
          ))}
        </div>
      </div>
    </main>
  );
}
