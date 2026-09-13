"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Pencil, Download, Upload, RotateCcw, Link2 } from "lucide-react";
import { useProjects } from "@/lib/projects-store";
import { useAdmin, isDefaultPassword } from "@/lib/admin-auth";
import { formatBytes, uid, type AttachedFile, type Project } from "@/lib/types";
import { readFiles } from "@/components/FilePreview";

const empty: Omit<Project, "id" | "createdAt"> = {
  title: "",
  summary: "",
  details: "",
  tags: [],
  category: "Web App",
  githubUrl: "",
  liveUrl: "",
  cover: "",
  files: [],
  featured: false,
};

const CATS: Project["category"][] = ["Web App", "Security", "Backend / API", "Database", "Other"];

export default function AdminPage() {
  const { projects, ready, add, update, remove, reset, exportJson, importJson } = useProjects();
  const { unlocked, unlock, lock } = useAdmin();
  const [form, setForm] = useState(empty);
  const [tagsText, setTagsText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [urlName, setUrlName] = useState("");
  const [urlHref, setUrlHref] = useState("");
  const [msg, setMsg] = useState("");
  const [importText, setImportText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const totalBytes = useMemo(
    () => projects.reduce((n, p) => n + p.files.reduce((a, f) => a + f.size, 0), 0),
    [projects]
  );

  function set<K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onPickFiles(files: FileList | null) {
    if (!files?.length) return;
    try {
      const picked = await readFiles(files);
      const big = picked.filter((f) => f.size > 8 * 1024 * 1024);
      setForm((f) => ({ ...f, files: [...picked, ...f.files] }));
      setMsg(
        big.length
          ? `⚠️ ${big.length} file(s) > 8MB will strain browser storage. For big videos/zips prefer "attach by URL" (put file in public/uploads/).`
          : `Added ${picked.length} file(s). Previews adapt to type: image / video / PDF / code / audio / archive.`
      );
    } catch {
      setMsg("Could not read those files.");
    }
  }

  function onPickCover(file: File | undefined) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setForm((f) => ({ ...f, cover: String(r.result) }));
    r.readAsDataURL(file);
  }

  function attachByUrl() {
    if (!urlHref.trim()) return;
    const f: AttachedFile = {
      id: uid(),
      name: urlName.trim() || urlHref.split("/").pop() || "linked-file",
      mime: "application/octet-stream",
      size: 0,
      url: urlHref.trim(),
    };
    setForm((prev) => ({ ...prev, files: [f, ...prev.files] }));
    setUrlName("");
    setUrlHref("");
  }

  function save() {
    if (!form.title.trim() || !form.summary.trim()) {
      setMsg("Title and short summary are required (recruiters skim!).");
      return;
    }
    const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
    if (editingId) {
      update(editingId, { ...form, tags });
      setMsg("Project updated ✓");
    } else {
      add({
        ...form,
        tags,
        id: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + uid().slice(0, 4),
        createdAt: new Date().toISOString(),
      });
      setMsg("Project published ✓ — it now appears on the homepage and keeps its previews.");
    }
    setForm(empty);
    setTagsText("");
    setEditingId(null);
  }

  function edit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title, summary: p.summary, details: p.details, tags: p.tags,
      category: p.category, githubUrl: p.githubUrl ?? "", liveUrl: p.liveUrl ?? "",
      cover: p.cover ?? "", files: p.files, featured: !!p.featured,
    });
    setTagsText(p.tags.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function downloadExport() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-projects.json";
    a.click();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-300">
        <ArrowLeft size={15} /> Back to site
      </Link>
      {!unlocked ? (
        <AdminLogin onUnlock={unlock} />
      ) : (
      <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="mt-2 text-3xl font-bold text-white">Manage projects</h1>
        <button
          onClick={lock}
          className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-300 hover:border-red-400 hover:text-red-300"
        >
          Lock (log out)
        </button>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-zinc-400">
        Upload project files, paste website + GitHub links, and each project gets an automatic preview
        (images, video, PDFs, code, audio, zips). Stored in this browser — use Export to back up / publish permanently.
        Browser storage ≈ {formatBytes(totalBytes)} used; keep uploads under ~8MB each.
      </p>
      {msg && <p className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">{msg}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* FORM */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <h2 className="font-semibold text-white">{editingId ? "Edit project" : "New project"}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Title — e.g. Secure Login API + Audit Log"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={form.category} onChange={(e) => set("category", e.target.value as Project["category"])}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none">
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <label className="flex items-center gap-2 text-zinc-300">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-emerald-500" />
                Featured on homepage
              </label>
            </div>
            <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={2}
              placeholder="Short summary (1–2 lines, recruiter-facing)"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
            <textarea value={form.details} onChange={(e) => set("details", e.target.value)} rows={5}
              placeholder="Longer case study: problem, stack, security choices, what you learned…"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Tags, comma-separated — Next.js, PostgreSQL, OWASP"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={form.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} placeholder="GitHub URL — https://github.com/you/repo"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
              <input value={form.liveUrl ?? ""} onChange={(e) => set("liveUrl", e.target.value)} placeholder="Live website URL — https://… (gets iframe preview)"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
            </div>

            {/* cover */}
            <div className="rounded-xl border border-white/10 p-3">
              <p className="text-zinc-300">Cover image</p>
              <div className="mt-2 flex items-center gap-3">
                <button onClick={() => coverRef.current?.click()} className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20">Choose image</button>
                {form.cover && <button onClick={() => set("cover", "")} className="text-xs text-zinc-500 underline">remove</button>}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickCover(e.target.files?.[0])} />
              {form.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.cover} alt="cover preview" className="mt-3 h-32 w-full rounded-lg object-cover" />
              )}
            </div>

            {/* files */}
            <div className="rounded-xl border border-white/10 p-3">
              <p className="text-zinc-300">Project files — upload for auto-preview</p>
              <p className="text-xs text-zinc-500">Screenshots, demo mp4, report PDF, .zip source, code samples…</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20">
                  <Upload size={14} /> Upload files
                </button>
              </div>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => { onPickFiles(e.target.files); e.target.value = ""; }} />
              <div className="mt-2 flex gap-2">
                <input value={urlName} onChange={(e) => setUrlName(e.target.value)} placeholder="Label (optional)"
                  className="w-1/3 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white outline-none placeholder:text-zinc-600" />
                <input value={urlHref} onChange={(e) => setUrlHref(e.target.value)} placeholder="Attach by URL — /uploads/demo.mp4 or https://…"
                  className="flex-1 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white outline-none placeholder:text-zinc-600" />
                <button onClick={attachByUrl} className="rounded-lg bg-white/10 px-3 text-white hover:bg-white/20" title="Attach URL">
                  <Link2 size={15} />
                </button>
              </div>
              {form.files.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {form.files.map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-2 rounded-lg bg-black/40 px-3 py-1.5 text-xs text-zinc-300">
                      <span className="truncate">{f.name} · {formatBytes(f.size)}</span>
                      <button onClick={() => set("files", form.files.filter((x) => x.id !== f.id))} className="text-zinc-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={save} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 font-semibold text-zinc-950 hover:bg-emerald-400">
                <Plus size={15} /> {editingId ? "Save changes" : "Publish project"}
              </button>
              {editingId && (
                <button onClick={() => { setEditingId(null); setForm(empty); setTagsText(""); }} className="rounded-full border border-white/15 px-5 py-2.5 text-white">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LIST + BACKUP */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <h2 className="font-semibold text-white">Your projects ({ready ? projects.length : "…"})</h2>
            <div className="mt-3 space-y-2">
              {!ready ? (
                <p className="text-sm text-zinc-500">Loading…</p>
              ) : (
              projects.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate text-zinc-200">{p.title}</span>
                  <Link href={`/projects/${p.id}`} className="text-xs text-emerald-300 hover:underline">view</Link>
                  <button onClick={() => edit(p)} className="text-zinc-400 hover:text-white" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => remove(p.id)} className="text-zinc-500 hover:text-red-400" title="Delete"><Trash2 size={14} /></button>
                </div>
              ))
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 text-sm">
            <h2 className="font-semibold text-white">Backup / publish permanently</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Browser storage is per-device. To keep projects in git, Export JSON and paste into{" "}
              <code className="rounded bg-white/10 px-1">src/lib/seed.ts</code>.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={downloadExport} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20">
                <Download size={14} /> Export JSON
              </button>
              <button onClick={() => { if (confirm("Reset to starter projects?")) reset(); }} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20">
                <RotateCcw size={14} /> Reset
              </button>
            </div>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={3} placeholder='Paste exported JSON here, then click Import'
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none placeholder:text-zinc-600" />
            <button
              onClick={() => { try { importJson(importText); setMsg("Imported ✓"); setImportText(""); } catch { setMsg("Import failed — JSON must be an array of projects."); } }}
              className="mt-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            >
              Import JSON
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </main>
  );
}

function AdminLogin({ onUnlock }: { onUnlock: (pw: string) => boolean }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (onUnlock(pw)) {
      setError("");
    } else {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <h1 className="text-xl font-bold text-white">Owner login</h1>
      <p className="mt-1 text-sm text-zinc-400">
        This area is for Nyasha only. Visitors can browse the portfolio — no login needed.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Owner password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          Unlock
        </button>
      </form>
      {isDefaultPassword() && (
        <p className="mt-3 text-xs text-amber-300/90">
          Using the default password — set your own in <code className="rounded bg-white/10 px-1">.env.local</code> as{" "}
          <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_ADMIN_PASSWORD</code> (see{" "}
          <code className="rounded bg-white/10 px-1">.env.example</code>), then restart the dev server.
        </p>
      )}
    </div>
  );
}
