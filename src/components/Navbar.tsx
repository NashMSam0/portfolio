"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#github", label: "GitHub" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { unlocked } = useAdmin();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
            <ShieldCheck size={18} />
          </span>
          <span className="text-sm sm:text-base">
            {siteConfig.name} <span className="text-zinc-500">/ portfolio</span>
          </span>
        </Link>
        <div className="hidden items-center gap-5 text-sm text-zinc-300 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-emerald-300">
              {l.label}
            </a>
          ))}
          {unlocked && (
            <Link
              href="/admin"
              className="rounded-full bg-emerald-500 px-4 py-1.5 font-medium text-zinc-950 transition hover:bg-emerald-400"
            >
              + Add project
            </Link>
          )}
        </div>
        <button
          className="text-zinc-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 text-sm md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-zinc-200 hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          {unlocked && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-emerald-500 px-4 py-2 text-center font-medium text-zinc-950"
            >
              + Add project
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
