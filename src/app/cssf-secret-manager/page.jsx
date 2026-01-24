// src/app/admin-portal/page.jsx
import Header from "../component/Header";
import Footer from "../component/Footer";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Management Portal</h1>
          <p className="text-gray-500">Add new sermons to the website instantly.</p>
        </div>
        
        
        
        <div className="mt-12 text-sm text-gray-400 max-w-xs text-center">
          <p>Tip: Ensure Google Drive files are set to "Anyone with the link can view" before publishing.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}