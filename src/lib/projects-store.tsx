"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedProjects } from "./seed";
import type { Project } from "./types";

// NOTE: bump this key whenever src/lib/seed.ts changes, so browsers drop
// stale cached projects instead of hydrating old titles/content.
const KEY = "portfolio.projects.v2";
const OLD_KEYS = ["portfolio.projects.v1"];

interface Store {
  projects: Project[];
  /** False on server + first client render; true once localStorage has been read. */
  ready: boolean;
  add: (p: Project) => void;
  update: (id: string, patch: Partial<Project>) => void;
  remove: (id: string) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (json: string) => void;
}

const Ctx = createContext<Store | null>(null);

function load(): Project[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedProjects;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedProjects;
    return parsed as Project[];
  } catch {
    return seedProjects;
  }
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  // Always start from seed so server HTML and the first client render match.
  // Stored projects are loaded in an effect after mount (see below).
  const [state, setState] = useState<{ projects: Project[]; ready: boolean }>({
    projects: seedProjects,
    ready: false,
  });
  const { projects, ready } = state;
  const setProjects = useCallback(
    (updater: (ps: Project[]) => Project[]) =>
      setState((s) => ({ ...s, projects: updater(s.projects) })),
    []
  );

  // Sync from the external store (localStorage) after mount. This setState is
  // intentional: it is the documented pattern for reading browser-only storage
  // without causing hydration mismatches.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ projects: load(), ready: true });
    for (const k of OLD_KEYS) {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    }
  }, []);

  // Persist — but only after the initial load, so we never overwrite stored
  // data with the seed on mount.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(projects));
    } catch {
      // localStorage quota exceeded (big uploads) — keep in-memory only
    }
  }, [projects, ready]);

  const add = useCallback((p: Project) => setProjects((ps) => [p, ...ps]), [setProjects]);
  const update = useCallback(
    (id: string, patch: Partial<Project>) =>
      setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [setProjects]
  );
  const remove = useCallback((id: string) => setProjects((ps) => ps.filter((p) => p.id !== id)), [setProjects]);
  const reset = useCallback(() => setProjects(() => seedProjects), [setProjects]);
  const exportJson = useCallback(() => JSON.stringify(projects, null, 2), [projects]);
  const importJson = useCallback((json: string) => {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) throw new Error("JSON must be an array of projects");
    setProjects(() => parsed as Project[]);
  }, [setProjects]);

  const value = useMemo(
    () => ({ projects, ready, add, update, remove, reset, exportJson, importJson }),
    [projects, ready, add, update, remove, reset, exportJson, importJson]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProjects(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProjects must be used inside <ProjectsProvider>");
  return ctx;
}
