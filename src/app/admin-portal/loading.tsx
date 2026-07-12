export default function AdminPortalLoading() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-24 bg-red-100 rounded-lg" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 space-y-4">
                <div className="h-6 w-32 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-100 rounded-lg" />
                <div className="h-10 bg-slate-100 rounded-lg" />
                <div className="h-10 bg-slate-100 rounded-lg" />
                <div className="flex gap-2">
                  <div className="h-12 flex-1 bg-blue-100 rounded-lg" />
                  <div className="h-12 flex-1 bg-red-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 h-96" />
          </div>
        </div>
      </div>
    </main>
  );
}
