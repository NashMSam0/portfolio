"use client";

import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";
import { siteConfig } from "@/lib/site";
import type { GithubRepo } from "@/lib/github";

export default function GithubRepos() {
  const username = siteConfig.githubUsername;
  const unconfigured = !username || username === "your-github-username";
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");

  // Subscribe to the GitHub API — setState only inside async callbacks.
  useEffect(() => {
    if (unconfigured) return;
    let alive = true;
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d) => {
        if (!alive) return;
        setRepos(d);
        setStatus("idle");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [username, unconfigured]);

  if (unconfigured) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-zinc-400">
        <p className="font-medium text-zinc-200">Connect your GitHub to auto-show repos here</p>
        <p className="mt-1">
          Edit <code className="rounded bg-white/10 px-1">src/lib/site.ts</code> → set{" "}
          <code className="rounded bg-white/10 px-1">githubUsername</code> to your handle. Your
          latest 6 repos will appear automatically.
        </p>
        <a
          href={siteConfig.githubUrl}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
        >
          <GithubIcon size={15} /> Open GitHub profile
        </a>
      </div>
    );
  }

  if (status === "loading") return <p className="text-sm text-zinc-500">Loading GitHub repos…</p>;
  if (status === "error")
    return <p className="text-sm text-zinc-500">Couldn&apos;t load GitHub repos right now.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((r) => {
        const live = r.homepage?.trim()
          ? r.homepage.startsWith("http")
            ? r.homepage
            : `https://${r.homepage}`
          : null;
        return (
          <div
            key={r.id}
            className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-emerald-500/40"
          >
            <a
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white transition hover:text-emerald-300"
            >
              <GithubIcon size={16} className="shrink-0 text-zinc-400" />
              <span className="truncate font-medium">{r.name}</span>
            </a>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm text-zinc-400">
              {r.description ?? "No description yet."}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
              {r.language && <span className="rounded bg-white/5 px-2 py-0.5">{r.language}</span>}
              <span className="inline-flex items-center gap-1">
                <Star size={12} /> {r.stargazers_count}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 pt-1">
              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
                >
                  <ExternalLink size={13} /> Live website
                </a>
              )}
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white transition hover:border-emerald-400"
              >
                <GithubIcon size={13} /> Repository
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
