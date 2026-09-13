"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Globe } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { useProjects } from "@/lib/projects-store";
import { OwnerOnly } from "@/lib/admin-auth";
import FilePreview from "@/components/FilePreview";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { projects, ready } = useProjects();
  const project = projects.find((p) => p.id === params.id);

  if (!ready) {
    return (
      <main className="mx-auto max-w-4xl animate-pulse px-4 py-10">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-6 h-8 w-2/3 rounded bg-white/10" />
        <div className="mt-3 h-4 w-full rounded bg-white/5" />
        <div className="mt-2 h-4 w-5/6 rounded bg-white/5" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-zinc-400">Project not found (it may live only in another browser — projects are stored locally).</p>
        <Link href="/#projects" className="mt-4 inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950">
          ← Back to projects
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-300">
        <ArrowLeft size={15} /> All projects
      </Link>

      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.cover} alt={project.title} className="mt-6 max-h-80 w-full rounded-2xl border border-white/10 object-cover" />
      )}

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{project.category}</p>
      <h1 className="mt-1 text-3xl font-bold text-white">{project.title}</h1>
      <p className="mt-3 leading-relaxed text-zinc-300">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400">
            <GithubIcon size={15} /> GitHub repo
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-emerald-400">
            <ExternalLink size={15} /> Live website
          </a>
        )}
        <OwnerOnly>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/20 px-4 py-2 text-sm text-zinc-400 hover:text-emerald-300">
            Edit in admin
          </Link>
        </OwnerOnly>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-300">{t}</span>
        ))}
      </div>

      {project.details && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="font-semibold text-white">About this project</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{project.details}</p>
        </div>
      )}

      {/* Live website preview */}
      {project.liveUrl && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 font-semibold text-white"><Globe size={16} /> Live preview</h2>
          <p className="mt-1 text-xs text-zinc-500">If the site blocks embedding, use the “Live website” button above.</p>
          <iframe
            src={project.liveUrl}
            title={`${project.title} live preview`}
            className="mt-3 h-[480px] w-full rounded-2xl border border-white/10 bg-white"
            loading="lazy"
          />
        </div>
      )}

      {/* Attached files with type-aware previews */}
      <div className="mt-8">
        <h2 className="font-semibold text-white">
          Files & previews {project.files.length > 0 && <span className="text-zinc-500">({project.files.length})</span>}
        </h2>
        {project.files.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            No files attached yet. Add screenshots, demo videos, PDFs or zips from <Link href="/admin" className="text-emerald-300 underline">/admin</Link>.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {project.files.map((f) => (
              <FilePreview key={f.id} file={f} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
