export default function ShopLoading() {
  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{ background: "var(--bg)" }}
    >
      {/* Hero skeleton */}
      <div
        className="mb-12 py-12 px-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2.5 w-10 rounded-sm" style={{ background: "var(--surface)", opacity: 0.5 }} />
            <div className="h-2.5 w-2" style={{ background: "var(--surface)", opacity: 0.3 }} />
            <div className="h-2.5 w-16 rounded-sm" style={{ background: "var(--surface)", opacity: 0.5 }} />
          </div>
          <div className="h-3 w-32 rounded-sm" style={{ background: "var(--surface)", opacity: 0.4 }} />
          <div className="h-10 w-80 rounded-sm animate-pulse" style={{ background: "var(--surface)", opacity: 0.6 }} />
          <div className="h-3 w-56 rounded-sm" style={{ background: "var(--surface)", opacity: 0.35 }} />
        </div>
      </div>

      {/* Products skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="aspect-square w-full mb-3"
                style={{ background: "var(--surface)", opacity: 0.5 }}
              />
              <div className="space-y-2">
                <div className="h-2.5 w-3/4 rounded-sm" style={{ background: "var(--surface)", opacity: 0.4 }} />
                <div className="h-3 w-1/3 rounded-sm" style={{ background: "var(--surface)", opacity: 0.5 }} />
                <div className="h-7 w-full rounded-sm" style={{ background: "var(--surface)", opacity: 0.3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
