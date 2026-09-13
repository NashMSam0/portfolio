"use client";

import { useMemo, useState } from "react";
import { useProjects } from "@/lib/projects-store";
import ProjectCard from "./ProjectCard";
import { Search } from "lucide-react";

const cats = ["All", "Web App", "Security", "Backend / API", "Database", "Other"] as const;

export default function HomeProjects() {
  const { projects, ready } = useProjects();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!needle) return true;
      return [p.title, p.summary, p.details, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [projects, q, cat]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-zinc-900/70 px-4 py-2.5 text-sm text-zinc-300">
          <Search size={15} className="text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, tags, tech…"
            className="w-full bg-transparent outline-none placeholder:text-zinc-600"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                cat === c
                  ? "bg-emerald-500 text-zinc-950"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {!ready ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
              <div className="h-28 bg-white/5" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-zinc-500">
          No projects match.{" "}
          <a href="/admin" className="text-emerald-300 underline">
            Add your first project →
          </a>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
