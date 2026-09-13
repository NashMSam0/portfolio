"use client";

import { useEffect, useState } from "react";
import { formatBytes, previewKindForFile, type AttachedFile } from "@/lib/types";
import { FileText, Download, Archive, ExternalLink } from "lucide-react";

/** Renders the right preview for an uploaded/attached file. */
export default function FilePreview({ file }: { file: AttachedFile }) {
  const kind = previewKindForFile(file);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (kind !== "code") return;
    let alive = true;
    fetch(file.url)
      .then((r) => r.text())
      .then((t) => alive && setText(t.slice(0, 20000)))
      .catch(() => alive && setText("Could not load preview."));
    return () => {
      alive = false;
    };
  }, [file.url, kind]);

  const meta = (
    <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-zinc-400">
      <span className="truncate">
        {file.name} · {formatBytes(file.size)}
      </span>
      <a
        href={file.url}
        download={file.name}
        className="inline-flex shrink-0 items-center gap-1 text-emerald-300 hover:text-emerald-200"
      >
        <Download size={13} /> Download
      </a>
    </div>
  );

  if (kind === "image") {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file.url} alt={file.name} className="max-h-[480px] w-full object-contain bg-black" />
        {meta}
      </div>
    );
  }
  if (kind === "video") {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <video src={file.url} controls className="max-h-[480px] w-full bg-black" />
        {meta}
      </div>
    );
  }
  if (kind === "audio") {
    return (
      <div className="rounded-xl border border-white/10 bg-black/40 p-3">
        <p className="mb-2 truncate text-sm text-zinc-200">{file.name}</p>
        <audio src={file.url} controls className="w-full" />
        {meta}
      </div>
    );
  }
  if (kind === "pdf") {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <iframe src={file.url} title={file.name} className="h-[560px] w-full bg-white" />
        {meta}
      </div>
    );
  }
  if (kind === "code") {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-zinc-400">
          <FileText size={13} /> <span className="truncate">{file.name}</span>
        </div>
        <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed text-zinc-200">
          {text ?? "Loading preview…"}
        </pre>
        {meta}
      </div>
    );
  }
  if (kind === "archive") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-300">
          <Archive size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-zinc-100">{file.name}</p>
          <p className="text-xs text-zinc-500">
            Archive · {formatBytes(file.size)} — download to view contents
          </p>
        </div>
        <a
          href={file.url}
          download={file.name}
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
        >
          <Download size={13} /> Get file
        </a>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-zinc-200">
        <FileText size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-zinc-100">{file.name}</p>
        <p className="text-xs text-zinc-500">
          {file.mime || "file"} · {formatBytes(file.size)}
        </p>
      </div>
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
      >
        <ExternalLink size={13} /> Open
      </a>
    </div>
  );
}

/** Read <input type=file> selection into storable AttachedFile objects (data URLs). */
export function readFiles(files: FileList | File[]): Promise<AttachedFile[]> {
  const list = Array.from(files);
  return Promise.all(
    list.map(
      (f) =>
        new Promise<AttachedFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name: f.name,
              mime: f.type || "application/octet-stream",
              size: f.size,
              url: String(reader.result),
            });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(f);
        })
    )
  );
}
