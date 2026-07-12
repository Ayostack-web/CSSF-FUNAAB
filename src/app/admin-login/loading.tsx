export default function AdminLoginLoading() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded mx-auto mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-slate-100 rounded-lg" />
          <div className="h-12 bg-slate-100 rounded-lg" />
          <div className="h-12 bg-blue-200 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
