"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/**
 * Profile photo card. If public/profile.jpg is missing (or fails to load),
 * shows an initials fallback instead of a broken-image icon.
 */
export default function ProfilePhoto() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
      {failed ? (
        <div className="grid aspect-square w-full place-items-center bg-gradient-to-br from-emerald-500/30 via-cyan-500/15 to-transparent">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-white">{initials(siteConfig.name)}</p>
            <p className="mt-2 px-6 text-xs text-zinc-400">
              Save your photo as <code className="rounded bg-white/10 px-1">public/profile.jpg</code> to
              show it here
            </p>
          </div>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={siteConfig.profileImage}
          alt={`${siteConfig.name} — profile photo`}
          className="aspect-square w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="p-4">
        <p className="font-semibold text-white">{siteConfig.name}, 23</p>
        <p className="text-sm text-zinc-400">{siteConfig.role}</p>
      </div>
    </div>
  );
}
