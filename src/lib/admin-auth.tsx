"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const SESSION_KEY = "portfolio.admin.unlocked.v1";

/**
 * Owner gate for project management.
 *
 * How it works: the site itself is fully public. Management UI (nav button,
 * footer link, /admin dashboard) only renders after entering the owner
 * password, which unlocks the session (sessionStorage — per tab, cleared
 * when the tab closes).
 *
 * Honest limitation: this is a static site, so the password lives in the
 * client bundle (NEXT_PUBLIC_ADMIN_PASSWORD). It hides management from
 * casual visitors; it is NOT real access control. That is acceptable here
 * because project data lives in each visitor's own browser (localStorage) —
 * a visitor can never change YOUR published content, only their local copy.
 * Set a custom password in `.env.local` (see `.env.example`).
 */
function expectedPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "changeme123";
}

export function isDefaultPassword(): boolean {
  return !process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
}

interface AdminAuth {
  unlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
}

const Ctx = createContext<AdminAuth | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  // Start locked so server HTML and first client render always match.
  const [unlocked, setUnlocked] = useState(false);

  // Restore an unlocked tab session after mount.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnlocked(true);
      }
    } catch {
      // storage unavailable — stay locked
    }
  }, []);

  const unlock = useCallback((password: string) => {
    if (password === expectedPassword()) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
      setUnlocked(true);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  }, []);

  const value = useMemo(() => ({ unlocked, unlock, lock }), [unlocked, unlock, lock]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin(): AdminAuth {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminAuthProvider>");
  return ctx;
}

/** Renders children only for the unlocked owner. Renders nothing otherwise. */
export function OwnerOnly({ children }: { children: React.ReactNode }) {
  const { unlocked } = useAdmin();
  if (!unlocked) return null;
  return <>{children}</>;
}
