export default function Loading() {
  return (
    <main className="min-h-screen bg-blue-50">
      {/* Hero skeleton */}
      <div className="h-[80vh] bg-gradient-to-br from-[#071026] via-[#0a1a35] to-[#071026] flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-12 w-80 bg-white/10 rounded-lg mx-auto" />
          <div className="h-6 w-60 bg-white/10 rounded-lg mx-auto" />
          <div className="h-12 w-32 bg-white/20 rounded-full mx-auto mt-6" />
        </div>
      </div>

      {/* Content skeletons */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* About skeleton */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-[400px] bg-blue-100 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 w-48 bg-blue-100 rounded mx-auto animate-pulse" />
            <div className="h-4 w-full bg-blue-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-blue-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-blue-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-64 bg-blue-100 rounded mx-auto animate-pulse" />
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-80 bg-blue-100" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-32 bg-blue-100 rounded" />
                  <div className="h-4 w-full bg-blue-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
