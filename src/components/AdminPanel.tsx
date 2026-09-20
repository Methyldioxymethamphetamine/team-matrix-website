"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { WorkItem } from "@/data/works";
import type { Member, Department } from "@/data/members";
import type { SponsorEntry } from "@/app/api/sponsors/route";

type AuthState = "checking" | "login" | "dashboard";
type Tab = "gallery" | "sponsors" | "members";

const DEPARTMENTS: Department[] = ["Leadership", "Mechanical", "Electronics", "Algorithms", "Management"];

export default function AdminPanel() {
  const [auth, setAuth] = useState<AuthState>("checking");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { authenticated: boolean }) => setAuth(data.authenticated ? "dashboard" : "login"))
      .catch(() => setAuth("login"));
  }, []);

  if (auth === "checking") {
    return <Centered>Checking session…</Centered>;
  }
  if (auth === "login") {
    return <LoginForm onSuccess={() => setAuth("dashboard")} />;
  }
  return <Dashboard onLoggedOut={() => setAuth("login")} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black text-slate-400 flex items-center justify-center font-mono text-sm">
      {children}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        setSubmitting(false);
        return;
      }
      onSuccess();
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-[#0d0d14]/90 border border-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      >
        <h1 className="font-[family-name:var(--font-black-ops)] text-2xl text-white mb-1">Admin</h1>
        <p className="font-mono text-xs text-slate-400 mb-6">Team Matrix content panel</p>

        <label className="block font-mono text-[11px] uppercase tracking-widest text-slate-400 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm outline-none focus:border-red-500/50 mb-4"
        />

        {error && <p className="text-red-400 text-xs font-mono mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
        >
          {submitting ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLoggedOut }: { onLoggedOut: () => void }) {
  const [tab, setTab] = useState<Tab>("gallery");

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    onLoggedOut();
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/90 backdrop-blur">
        <h1 className="font-[family-name:var(--font-black-ops)] text-lg">Team Matrix — Admin</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          Log Out
        </button>
      </header>

      <nav className="flex gap-2 px-6 py-4 border-b border-white/5">
        {(["gallery", "sponsors", "members"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-red-600/90 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="px-6 py-8 max-w-5xl mx-auto">
        {tab === "gallery" && <GalleryTab />}
        {tab === "sponsors" && <SponsorsTab />}
        {tab === "members" && <MembersTab />}
      </main>
    </div>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-[#0d0d14]/80 border border-white/10 p-5">{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block font-mono text-[11px] uppercase tracking-widest text-slate-400 mb-1.5">{children}</label>;
}

const inputClass =
  "w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-sm outline-none focus:border-red-500/50";

function DeleteButton({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border border-red-500/30 text-red-300 hover:bg-red-950/50 disabled:opacity-40 transition-colors"
    >
      {busy ? "…" : "Remove"}
    </button>
  );
}

// ── Gallery tab ──────────────────────────────────────────────────────────

function GalleryTab() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingImg, setRemovingImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/works")
      .then((r) => r.json())
      .then((data: WorkItem[]) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setAdding(true);
    setError("");
    const form = new FormData();
    form.append("image", file);
    form.append("title", title);
    form.append("story", story);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to add photo");
      return;
    }
    setFile(null);
    setTitle("");
    setStory("");
    load();
  };

  const handleRemove = async (img: string) => {
    setRemovingImg(img);
    await fetch(`/api/admin/gallery?img=${encodeURIComponent(img)}`, { method: "DELETE" });
    setRemovingImg(null);
    load();
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="font-semibold mb-4">Add a photo</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <FieldLabel>Image (WEBP / PNG / JPEG)</FieldLabel>
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-300"
            />
          </div>
          <div>
            <FieldLabel>Title</FieldLabel>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Optional — derived from filename if blank" />
          </div>
          <div>
            <FieldLabel>Content (story shown when expanded)</FieldLabel>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={3} className={inputClass} />
          </div>
          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          <button
            type="submit"
            disabled={!file || adding}
            className="px-5 py-2 rounded-full bg-red-600/90 hover:bg-red-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            {adding ? "Uploading…" : "Add Photo"}
          </button>
        </form>
      </SectionCard>

      <SectionCard>
        <h2 className="font-semibold mb-4">Current photos ({items.length})</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.img} className="relative rounded-xl overflow-hidden bg-black/40 border border-white/5">
                <div className="relative aspect-square">
                  <Image src={item.img} alt={item.title ?? ""} fill className="object-cover" />
                </div>
                <div className="p-2 space-y-1.5">
                  <p className="text-xs text-slate-300 truncate">{item.title}</p>
                  <DeleteButton onClick={() => handleRemove(item.img)} busy={removingImg === item.img} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ── Sponsors tab ─────────────────────────────────────────────────────────

function SponsorsTab() {
  const [items, setItems] = useState<SponsorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((data: SponsorEntry[]) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !alt) return;
    setAdding(true);
    setError("");
    const form = new FormData();
    form.append("logo", file);
    form.append("alt", alt);
    const res = await fetch("/api/admin/sponsors", { method: "POST", body: form });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to add sponsor");
      return;
    }
    setFile(null);
    setAlt("");
    load();
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    await fetch(`/api/admin/sponsors?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setRemovingId(null);
    load();
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="font-semibold mb-4">Add a sponsor</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <FieldLabel>Logo (WEBP / PNG / JPEG)</FieldLabel>
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-300"
            />
          </div>
          <div>
            <FieldLabel>Sponsor name</FieldLabel>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} className={inputClass} />
          </div>
          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          <button
            type="submit"
            disabled={!file || !alt || adding}
            className="px-5 py-2 rounded-full bg-red-600/90 hover:bg-red-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            {adding ? "Uploading…" : "Add Sponsor"}
          </button>
        </form>
      </SectionCard>

      <SectionCard>
        <h2 className="font-semibold mb-4">Current sponsors ({items.length})</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden bg-black/40 border border-white/5 p-3 flex flex-col items-center gap-2">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
                  <Image src={item.src} alt={item.alt} fill className="object-contain p-1.5" />
                </div>
                <p className="text-xs text-slate-300 truncate w-full text-center">{item.alt}</p>
                <DeleteButton onClick={() => handleRemove(item.id)} busy={removingId === item.id} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ── Members tab ──────────────────────────────────────────────────────────

function MembersTab() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState("Active");
  const [department, setDepartment] = useState<Department>("Mechanical");
  const [lead, setLead] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data: Member[]) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !name || !title) return;
    setAdding(true);
    setError("");
    const form = new FormData();
    form.append("avatar", file);
    form.append("name", name);
    form.append("title", title);
    form.append("handle", handle);
    form.append("status", status);
    form.append("department", department);
    form.append("lead", String(lead));
    const res = await fetch("/api/admin/members", { method: "POST", body: form });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to add member");
      return;
    }
    setFile(null);
    setName("");
    setTitle("");
    setHandle("");
    setStatus("Active");
    setDepartment("Mechanical");
    setLead(false);
    load();
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    await fetch(`/api/admin/members?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setRemovingId(null);
    load();
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="font-semibold mb-4">Add a member</h2>
        <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <FieldLabel>Photo (WEBP / PNG / JPEG)</FieldLabel>
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-300"
            />
          </div>
          <div>
            <FieldLabel>Name</FieldLabel>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <FieldLabel>Title / Role</FieldLabel>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <FieldLabel>Handle (no @)</FieldLabel>
            <input value={handle} onChange={(e) => setHandle(e.target.value)} className={inputClass} placeholder="placeholder" />
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass} />
          </div>
          <div>
            <FieldLabel>Department</FieldLabel>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className={inputClass}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={lead} onChange={(e) => setLead(e.target.checked)} />
            Show in Leadership filter
          </label>

          {error && <p className="text-red-400 text-xs font-mono sm:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={!file || !name || !title || adding}
            className="sm:col-span-2 px-5 py-2 rounded-full bg-red-600/90 hover:bg-red-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            {adding ? "Uploading…" : "Add Member"}
          </button>
        </form>
      </SectionCard>

      <SectionCard>
        <h2 className="font-semibold mb-4">Current members ({items.length})</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden bg-black/40 border border-white/5 p-3 flex flex-col items-center gap-2">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image src={item.avatarUrl} alt={item.name} fill className="object-cover" />
                </div>
                <p className="text-xs text-slate-200 truncate w-full text-center">{item.name}</p>
                <p className="text-[11px] text-slate-500 truncate w-full text-center">{item.title}</p>
                <DeleteButton onClick={() => handleRemove(item.id)} busy={removingId === item.id} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
