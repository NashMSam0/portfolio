"use client";

import { OwnerOnly } from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-500">
      © {new Date().getFullYear()} {siteConfig.name} · Built with Next.js
      <OwnerOnly>
        {" "}·{" "}
        <a href="/admin" className="underline hover:text-emerald-300">
          Manage projects
        </a>
      </OwnerOnly>
    </footer>
  );
}
