"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, SquarePen, X } from "lucide-react";
import { useAdmin } from "@/lib/admin-auth";

/**
 * Discreet owner entry point, pinned to the bottom-right corner.
 * Visitors see a faint lock dot; clicking it asks for the owner password.
 * Once unlocked it becomes a shortcut to /admin.
 */
export default function CornerLogin() {
  const { unlocked, unlock } = useAdmin();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (unlock(pw)) {
      setOpen(false);
      setPw("");
      setError("");
    } else {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <>
      {unlocked ? (
        <Link
          href="/admin"
          title="Manage projects (owner)"
          className="fixed bottom-4 right-4 z-50 grid size-10 place-items-center rounded-full border border-emerald-500/40 bg-zinc-900/90 text-emerald-300 shadow-lg backdrop-blur transition hover:bg-zinc-800"
        >
          <SquarePen size={16} />
        </Link>
      ) : (
        <button
          onClick={() => setOpen(true)}
          title="Owner login"
          aria-label="Owner login"
          className="fixed bottom-4 right-4 z-50 grid size-9 place-items-center rounded-full border border-white/10 bg-zinc-900/70 text-zinc-600 backdrop-blur transition hover:border-emerald-500/40 hover:text-emerald-300"
        >
          <Lock size={14} />
        </button>
      )}

      {open && !unlocked && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Owner login</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Password"
                autoFocus
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
