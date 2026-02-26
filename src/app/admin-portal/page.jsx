"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import BannerAdmin from "../component/BannerAdmin";

export default function AdminDashboardPage() {
  const ADMIN_EMAIL = "ayokunleshittu@gmail.com";
  // --- Account Info State ---
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [accountNameInput, setAccountNameInput] = useState("");
  const [accountNumberInput, setAccountNumberInput] = useState("");
  const [bankInput, setBankInput] = useState("");
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);
  const [accountInfoMessage, setAccountInfoMessage] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerPhoneSecondary, setFooterPhoneSecondary] = useState("");
  const [footerPhoneInput, setFooterPhoneInput] = useState("");
  const [footerPhoneSecondaryInput, setFooterPhoneSecondaryInput] = useState("");
  const [footerPhoneLoading, setFooterPhoneLoading] = useState(false);
  const [footerPhoneMessage, setFooterPhoneMessage] = useState("");

  // Fetch account info from API
  const fetchAccountInfo = async () => {
    try {
      setAccountInfoLoading(true);
      const res = await fetch("/api/account-number/update");
      const data = await res.json();
      setAccountName(data.accountName || "");
      setAccountNumber(data.accountNumber || "");
      setBank(data.bank || "");
      setAccountNameInput(data.accountName || "");
      setAccountNumberInput(data.accountNumber || "");
      setBankInput(data.bank || "");
    } catch (e) {
      setAccountName("");
      setAccountNumber("");
      setBank("");
      setAccountNameInput("");
      setAccountNumberInput("");
      setBankInput("");
    } finally {
      setAccountInfoLoading(false);
    }
  };

  // Update account info via API
  const handleAccountInfoUpdate = async (e) => {
    e.preventDefault();
    setAccountInfoLoading(true);
    setAccountInfoMessage("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch("/api/account-number/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accountName: accountNameInput, accountNumber: accountNumberInput, bank: bankInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccountName(accountNameInput);
        setAccountNumber(accountNumberInput);
        setBank(bankInput);
        setAccountInfoMessage("Account info updated successfully.");
      } else {
        throw new Error(data.error || "Failed to update account info.");
      }
    } catch (e) {
      setAccountInfoMessage(e?.message || "Error updating account info.");
    } finally {
      setAccountInfoLoading(false);
    }
  };

  const fetchFooterPhone = async () => {
    try {
      setFooterPhoneLoading(true);
      const res = await fetch("/api/site-settings/footer-phone");
      const data = await res.json();
      const primaryPhone = data.footerPhone || "";
      const secondaryPhone = data.footerPhoneSecondary || "";
      setFooterPhone(primaryPhone);
      setFooterPhoneSecondary(secondaryPhone);
      setFooterPhoneInput(primaryPhone);
      setFooterPhoneSecondaryInput(secondaryPhone);
    } catch (e) {
      setFooterPhone("");
      setFooterPhoneSecondary("");
      setFooterPhoneInput("");
      setFooterPhoneSecondaryInput("");
    } finally {
      setFooterPhoneLoading(false);
    }
  };

  const handleFooterPhoneUpdate = async (e) => {
    e.preventDefault();
    setFooterPhoneLoading(true);
    setFooterPhoneMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch("/api/site-settings/footer-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          footerPhone: footerPhoneInput,
          footerPhoneSecondary: footerPhoneSecondaryInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update footer phone");
      }

      setFooterPhone(footerPhoneInput);
      setFooterPhoneSecondary(footerPhoneSecondaryInput);
      setFooterPhoneMessage("Contact phone numbers updated successfully.");
    } catch (error) {
      setFooterPhoneMessage(error?.message || "Error updating contact phone numbers.");
    } finally {
      setFooterPhoneLoading(false);
    }
  };

  // Delete (clear) account info
  const handleAccountInfoDelete = async () => {
    setAccountInfoLoading(true);
    setAccountInfoMessage("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch("/api/account-number/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accountName: "", accountNumber: "", bank: "" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccountName("");
        setAccountNumber("");
        setBank("");
        setAccountNameInput("");
        setAccountNumberInput("");
        setBankInput("");
        setAccountInfoMessage("Account info deleted.");
      } else {
        throw new Error(data.error || "Failed to delete account info.");
      }
    } catch (e) {
      setAccountInfoMessage(e?.message || "Error deleting account info.");
    } finally {
      setAccountInfoLoading(false);
    }
  };
  // --- Auth State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // --- Upload Form State (Sermons) ---
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Upload Form State (Worship) ---
  const [worshipTitle, setWorshipTitle] = useState("");
  const [worshipImage, setWorshipImage] = useState(null);
  const [worshipLoading, setWorshipLoading] = useState(false);

  // --- Dashboard State ---
  const [sermons, setSermons] = useState([]);
  const [worship, setWorship] = useState([]);

  const supabase = createClient();

  useEffect(() => {
    const checkAdminSession = async () => {
      const { data } = await supabase.auth.getSession();
      const userEmail = data?.session?.user?.email || "";
      setIsAdmin(userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    };

    checkAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userEmail = session?.user?.email || "";
      setIsAdmin(userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchSermons = async () => {
    const { data } = await supabase
      .from("sermons")
      .select("*")
      .order("created_at", { ascending: false });
    setSermons(data || []);
  };

  const fetchWorship = async () => {
    const { data } = await supabase
      .from("worship_images")
      .select("*")
      .order("order", { ascending: true });
    setWorship(data || []);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSermons();
      fetchWorship();
      fetchAccountInfo();
      fetchFooterPhone();
    }
  }, [isAdmin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message || "Login failed");
      setAuthLoading(false);
      return;
    }
    // Restrict access to only your Gmail
    const userEmail = data?.user?.email?.toLowerCase() || "";
    if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
      await supabase.auth.signOut();
      setAuthError("Access denied: Only your Gmail can login.");
      setAuthLoading(false);
      return;
    }
    setIsAdmin(true);
    setAuthLoading(false);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !link) return alert("Please provide both a title and a link.");

    setLoading(true);
    const { error } = await supabase
      .from("sermons")
      .insert([{ title, drive_link: link }]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Sermon Published successfully!");
      setTitle("");
      setLink("");
      fetchSermons();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this sermon?")) {
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) alert("Error deleting: " + error.message);
      else fetchSermons();
    }
  };

  const handleWorshipUpload = async (e) => {
    e.preventDefault();
    if (!worshipTitle || !worshipImage) return alert("Please provide both a title and an image.");

    setWorshipLoading(true);
    try {
      const fileName = `worship-${Date.now()}-${worshipImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("worship_images")
        .upload(fileName, worshipImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("worship_images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error('Please login again');

      const apiRes = await fetch('/api/worship/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ title: worshipTitle, image_url: imageUrl, order: worship.length + 1 })
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || 'Server insert failed');

      alert('Worship image uploaded successfully!');
      setWorshipTitle('');
      setWorshipImage(null);
      fetchWorship();
    } catch (error) {
      alert("Error uploading: " + error.message);
    } finally {
      setWorshipLoading(false);
    }
  };

  const handleDeleteWorship = async (id) => {
    if (!confirm("Are you sure you want to delete this worship image?")) return;

    try {
      const item = worship.find((w) => w.id === id);
      const image_url = item?.image_url || null;

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error('Please login again');

      const res = await fetch('/api/worship/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ id, image_url })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      fetchWorship();
    } catch (err) {
      alert('Error deleting: ' + (err?.message || String(err)));
    }
  };

  // --- Rendering ---
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-bold hover:bg-blue-900 transition text-center"
              disabled={authLoading}
            >
              {authLoading ? "Logging in..." : "Login"}
            </button>
            {authError && <p className="text-red-600 text-sm text-center">{authError}</p>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">CSSF Admin Dashboard</h1>
            <p className="text-slate-500">Manage your website content in real-time.</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setIsAdmin(false);
              window.location.href = "/admin-login";
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-8">
            {/* Account Info Section */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Account Info</h2>
              <form onSubmit={handleAccountInfoUpdate} className="space-y-5">
                <input
                  type="text"
                  placeholder="Account Name"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={accountNameInput}
                  onChange={(e) => setAccountNameInput(e.target.value)}
                  disabled={accountInfoLoading}
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={accountNumberInput}
                  onChange={(e) => setAccountNumberInput(e.target.value)}
                  disabled={accountInfoLoading}
                />
                <input
                  type="text"
                  placeholder="Bank"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={bankInput}
                  onChange={(e) => setBankInput(e.target.value)}
                  disabled={accountInfoLoading}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={accountInfoLoading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    {accountInfoLoading ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    disabled={accountInfoLoading || (!accountName && !accountNumber && !bank)}
                    onClick={handleAccountInfoDelete}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
                {accountInfoMessage && (
                  <p className="text-green-600 text-sm">{accountInfoMessage}</p>
                )}
                <p className="text-gray-500 text-sm">Current: <span className="font-mono">{accountName || "Not set"} {accountNumber || ""} {bank || ""}</span></p>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Contact Info</h2>
              <form onSubmit={handleFooterPhoneUpdate} className="space-y-5">
                <input
                  type="tel"
                  placeholder="Primary Phone Number"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={footerPhoneInput}
                  onChange={(e) => setFooterPhoneInput(e.target.value)}
                  disabled={footerPhoneLoading}
                  required
                />
                <input
                  type="tel"
                  placeholder="Secondary Phone Number"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={footerPhoneSecondaryInput}
                  onChange={(e) => setFooterPhoneSecondaryInput(e.target.value)}
                  disabled={footerPhoneLoading}
                />
                <button
                  type="submit"
                  disabled={footerPhoneLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  {footerPhoneLoading ? "Saving..." : "Save Phone Numbers"}
                </button>
                {footerPhoneMessage && (
                  <p className="text-sm text-green-600">{footerPhoneMessage}</p>
                )}
                <p className="text-gray-500 text-sm">
                  Current: <span className="font-mono">{[footerPhone, footerPhoneSecondary].filter(Boolean).join(" , ") || "Not set"}</span>
                </p>
              </form>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Sermon</h2>
              <form onSubmit={handlePublish} className="space-y-5">
                <input
                  type="text"
                  placeholder="Sermon Title"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Google Drive Link"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  {loading ? "Publishing..." : "Publish to Website"}
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Live Sermons List</h2>
              <div className="divide-y divide-gray-100">
                {sermons.map((sermon) => (
                  <div key={sermon.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{sermon.title}</p>
                      <p className="text-xs text-gray-400">{new Date(sermon.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(sermon.id)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {sermons.length === 0 && <p className="text-gray-400 text-sm">No sermons found.</p>}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Worship Image</h2>
              <form onSubmit={handleWorshipUpload} className="space-y-5">
                <input
                  type="text"
                  placeholder="Image Title"
                  className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={worshipTitle}
                  onChange={(e) => setWorshipTitle(e.target.value)}
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none file:bg-blue-100 file:text-blue-900 file:px-3 file:py-1 file:rounded file:cursor-pointer file:border-0"
                    onChange={(e) => setWorshipImage(e.target.files?.[0] || null)}
                  />
                </div>
                <button
                  disabled={worshipLoading}
                  className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition disabled:bg-gray-400"
                >
                  {worshipLoading ? "Uploading..." : "Upload Image"}
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Worship Images</h2>
              <div className="divide-y divide-gray-100">
                {worship.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteWorship(item.id)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {worship.length === 0 && <p className="text-gray-400 text-sm">No worship images found.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">Event Banners</h3>
            <BannerAdmin />
          </div>
        </div>
      </div>
    </main>
  );
}