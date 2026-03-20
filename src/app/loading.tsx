export default function Loading() {
  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-2.5 w-12 rounded-sm" style={{ background: "var(--surface)", opacity: 0.6 }} />
          <div className="h-2.5 w-2 rounded-sm" style={{ background: "var(--surface)", opacity: 0.4 }} />
          <div className="h-2.5 w-20 rounded-sm" style={{ background: "var(--surface)", opacity: 0.6 }} />
        </div>

        {/* Title skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-3 w-24 rounded-sm" style={{ background: "var(--surface)", opacity: 0.5 }} />
          <div className="h-8 w-64 rounded-sm" style={{ background: "var(--surface)", opacity: 0.7 }} />
          <div className="h-3 w-48 rounded-sm" style={{ background: "var(--surface)", opacity: 0.4 }} />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="aspect-square w-full mb-3"
                style={{ background: "var(--surface)", opacity: 0.5 }}
              />
              <div className="space-y-2">
                <div className="h-2.5 w-3/4 rounded-sm" style={{ background: "var(--surface)", opacity: 0.4 }} />
                <div className="h-2.5 w-1/2 rounded-sm" style={{ background: "var(--surface)", opacity: 0.3 }} />
                <div className="h-4 w-1/3 rounded-sm" style={{ background: "var(--surface)", opacity: 0.5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
