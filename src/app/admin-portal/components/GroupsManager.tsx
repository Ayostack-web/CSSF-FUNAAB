"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import Image from "next/image";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Save } from "lucide-react";

interface Group {
  id: string;
  name: string;
  about: string;
  image: string;
  link: string | null;
  sort_order: number;
}

interface Draft {
  name: string;
  about: string;
  link: string;
}

function sanitizeFileName(name: string) {
  const clean = name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `group-${Date.now()}-${clean}`;
}

const GroupsManager: FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newAbout, setNewAbout] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);

  const supabase = createClient();

  const fetchGroups = useCallback(async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .order("sort_order", { ascending: true });
    const rows = (data || []) as Group[];
    setGroups(rows);
    setDrafts(
      Object.fromEntries(rows.map((g) => [g.id, { name: g.name, about: g.about, link: g.link || "" }]))
    );
  }, [supabase]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const getAccessToken = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token || "";
    if (!accessToken) throw new Error("Please login again");
    return accessToken;
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileName = sanitizeFileName(file.name);
    const { error } = await supabase.storage.from("group_images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("group_images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const setDraft = (id: string, patch: Partial<Draft>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleSave = async (group: Group) => {
    const draft = drafts[group.id];
    if (!draft?.name.trim() || !draft.about.trim()) {
      toast.error("Name and description are required.");
      return;
    }

    setSavingId(group.id);
    try {
      let image_url: string | undefined;
      const file = files[group.id];
      if (file) {
        image_url = await uploadPhoto(file);
      }

      const accessToken = await getAccessToken();
      const res = await fetch("/api/groups/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          id: group.id,
          name: draft.name,
          about: draft.about,
          link: draft.link,
          ...(image_url ? { image_url } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success(`${draft.name} updated!`);
      setFiles((prev) => ({ ...prev, [group.id]: null }));
      fetchGroups();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Update failed";
      toast.error("Error: " + message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (group: Group) => {
    toast(`Delete ${group.name}? This cannot be undone.`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const accessToken = await getAccessToken();
            const res = await fetch("/api/groups/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify({ id: group.id, image_url: group.image }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            toast.success(`${group.name} deleted.`);
            fetchGroups();
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error("Error deleting: " + message);
          }
        },
      },
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAbout.trim()) {
      toast.error("Please provide a name and description.");
      return;
    }

    setAdding(true);
    try {
      let image_url = "";
      if (newFile) {
        image_url = await uploadPhoto(newFile);
      }

      const accessToken = await getAccessToken();
      const res = await fetch("/api/groups/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ name: newName, about: newAbout, link: newLink, image_url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed");

      toast.success(`${newName} added!`);
      setNewName("");
      setNewAbout("");
      setNewLink("");
      setNewFile(null);
      fetchGroups();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Add failed";
      toast.error("Error: " + message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="card-shell">
        <h2 className="card-title text-2xl mb-6">Add a Group / Unit</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            type="text"
            placeholder="Group name (e.g. Ushering Unit)"
            className="h-12 rounded-lg"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <textarea
            placeholder="Short description..."
            rows={2}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            value={newAbout}
            onChange={(e) => setNewAbout(e.target.value)}
          />
          <Input
            type="text"
            placeholder="WhatsApp or form link (optional)"
            className="h-12 rounded-lg"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            className="h-12 rounded-lg file:bg-blue-100 file:text-blue-900 file:px-3 file:py-1 file:rounded file:cursor-pointer file:border-0"
            onChange={(e) => setNewFile(e.target.files?.[0] || null)}
          />
          <Button
            type="submit"
            disabled={adding}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {adding ? "Adding..." : "Add Group"}
          </Button>
        </form>
      </div>

      <div className="card-shell">
        <h2 className="card-title text-xl mb-4">Manage Groups</h2>
        <p className="text-xs text-gray-400 mb-4">
          Edit the name, description or link, optionally pick a new photo, then press Save.
          Changes go live on the website immediately.
        </p>
        <div className="space-y-6">
          {groups.map((group) => {
            const draft = drafts[group.id];
            if (!draft) return null;
            return (
              <div key={group.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-blue-50 shrink-0">
                    {files[group.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(files[group.id] as File)}
                        alt="New upload preview"
                        className="w-full h-full object-cover"
                      />
                    ) : group.image ? (
                      <Image src={group.image} alt={group.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <Input
                      type="text"
                      className="h-10 rounded-lg font-bold"
                      value={draft.name}
                      onChange={(e) => setDraft(group.id, { name: e.target.value })}
                    />
                    <textarea
                      placeholder="Description..."
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                      value={draft.about}
                      onChange={(e) => setDraft(group.id, { about: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="Link (optional)"
                      className="h-10 rounded-lg"
                      value={draft.link}
                      onChange={(e) => setDraft(group.id, { link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer">
                    <Upload size={14} />
                    {files[group.id] ? "Photo picked" : "Change photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setFiles((prev) => ({ ...prev, [group.id]: e.target.files?.[0] || null }))
                      }
                    />
                  </label>

                  <Button
                    onClick={() => handleSave(group)}
                    disabled={savingId === group.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-md text-sm px-4 inline-flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    {savingId === group.id ? "Saving..." : "Save"}
                  </Button>

                  <button
                    onClick={() => handleDelete(group)}
                    aria-label={`Delete ${group.name}`}
                    className="ml-auto p-2 rounded-md text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {groups.length === 0 && (
            <p className="text-gray-400 text-sm">
              No groups found yet. If you just ran the SQL, refresh this page.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupsManager;
