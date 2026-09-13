"use client";

import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "./icons";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition hover:border-emerald-500/40 hover:bg-zinc-900">
      {project.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.cover} alt={project.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-28 items-center justify-center bg-gradient-to-br from-emerald-500/25 via-cyan-500/15 to-transparent text-4xl">
          🛡️
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-medium text-emerald-300">
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 font-medium text-amber-300">
              <Star size={11} /> Featured
            </span>
          )}
          {project.files.length > 0 && (
            <span className="text-zinc-500">📎 {project.files.length} file{project.files.length > 1 ? "s" : ""}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-white transition group-hover:text-emerald-300">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 5).map((t) => (
            <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            View + preview
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repo"
              className="grid size-9 place-items-center rounded-full border border-white/15 text-zinc-200 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              <GithubIcon size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Live site"
              className="grid size-9 place-items-center rounded-full border border-white/15 text-zinc-200 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
