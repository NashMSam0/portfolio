"use client";

import { useState } from "react";
import { Mail, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WEB3FORMS_KEY = (process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "").trim();
// A Web3Forms access key is always a 36-char UUID. Anything else is a
// copy-paste mistake — treat it as missing so visitors still get a working path.
const KEY_VALID = UUID_RE.test(WEB3FORMS_KEY);

if (!KEY_VALID && process.env.NODE_ENV === "development") {
  console.warn(
    "[ContactForm] NEXT_PUBLIC_WEB3FORMS_KEY is missing or not a valid UUID — the form will fall back to the mail app. Paste the full UUID key into .env.local and restart the dev server."
  );
}

/**
 * Contact form:
 * - "Send" delivers the message straight to nyashamsamson@gmail.com via
 *   Web3Forms (free, no backend needed) — no mail app involved.
 *   Get a key at https://web3forms.com and set NEXT_PUBLIC_WEB3FORMS_KEY.
 *   Until a key is set, it falls back to opening the visitor's mail app
 *   with the message prefilled.
 * - "Send via WhatsApp" opens wa.me for the chosen number with the
 *   message prefilled.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState(siteConfig.phones[0].wa);
  const [hint, setHint] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function valid(): boolean {
    if (!name.trim() || !message.trim()) {
      setHint("Please add your name and a message first.");
      return false;
    }
    setHint("");
    return true;
  }

  function mailtoFallback() {
    const subject = encodeURIComponent(`Portfolio inquiry from ${name.trim()}`);
    const body = encodeURIComponent(
      `${message.trim()}\n\n— ${name.trim()}${email.trim() ? ` (${email.trim()})` : ""}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  async function sendEmail() {
    if (!valid() || status === "sending") return;
    if (!KEY_VALID) {
      setHint("Direct send isn't available — opening your mail app instead.");
      mailtoFallback();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio inquiry from ${name.trim()}`,
          from_name: name.trim(),
          email: email.trim() || "noreply@portfolio",
          message: message.trim(),
          botcheck: "",
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setHint(data.message || "Sending failed — try WhatsApp or your mail app instead.");
      }
    } catch {
      setStatus("error");
      setHint("Network error — try WhatsApp or your mail app instead.");
    }
  }

  function sendWhatsApp() {
    if (!valid()) return;
    const text = encodeURIComponent(
      `Hi Nyasha, I'm ${name.trim()}${email.trim() ? ` (${email.trim()})` : ""}. ${message.trim()}`
    );
    window.open(`https://wa.me/${target}?text=${text}`, "_blank", "noopener");
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500";

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
      <h3 className="font-semibold text-white">Send me a message</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Delivered straight to my inbox — no account or mail app needed.
      </p>
      {status === "sent" ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
          <div>
            <p className="text-sm font-medium text-emerald-200">Message sent ✓</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Thanks for reaching out — I&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-xs text-emerald-300 underline hover:text-emerald-200"
            >
              Send another
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={input} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (optional)"
              type="email"
              className={input}
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi Nyasha, I saw your portfolio…"
            rows={4}
            className={input}
          />
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            WhatsApp to
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white outline-none"
            >
              {siteConfig.phones.map((p) => (
                <option key={p.wa} value={p.wa}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          {hint && <p className="text-xs text-amber-300">{hint}</p>}
          {!KEY_VALID && (
            <p className="text-[11px] text-zinc-600">
              Direct delivery isn&apos;t configured on this copy yet — Send will open your mail app instead.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendEmail}
              disabled={status === "sending"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {status === "sending" ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <button
              onClick={sendWhatsApp}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
            >
              <MessageCircle size={15} /> Send via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
