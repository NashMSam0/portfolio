export type PreviewKind =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "code"
  | "website"
  | "archive"
  | "other";

export interface AttachedFile {
  id: string;
  name: string;
  mime: string;
  size: number;
  /** data: URL (for uploads kept in browser) or /uploads/... path or remote URL */
  url: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  details: string;
  tags: string[];
  category: "Web App" | "Security" | "Backend / API" | "Database" | "Other";
  githubUrl?: string;
  liveUrl?: string;
  cover?: string; // data URL or path — shown on cards
  files: AttachedFile[];
  featured?: boolean;
  createdAt: string; // ISO
}

export function previewKindForFile(f: AttachedFile): PreviewKind {
  const m = f.mime.toLowerCase();
  const n = f.name.toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  if (m === "application/pdf" || n.endsWith(".pdf")) return "pdf";
  if (
    m.startsWith("text/") ||
    /\.(js|jsx|ts|tsx|py|java|c|cpp|go|rs|json|md|txt|html|css|sql|yml|yaml|xml|sh)$/.test(n)
  )
    return "code";
  if (/\.zip$|\.rar$|\.7z$|\.tar|\.gz$/.test(n)) return "archive";
  return "other";
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
