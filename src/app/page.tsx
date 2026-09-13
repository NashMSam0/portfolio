import Link from "next/link";
import { Mail, MapPin, Download, ArrowRight, ShieldCheck, Database, Code2, Phone, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";
import HomeProjects from "@/components/HomeProjects";
import GithubRepos from "@/components/GithubRepos";
import ProfilePhoto from "@/components/ProfilePhoto";
import ContactForm from "@/components/ContactForm";
import { OwnerOnly } from "@/lib/admin-auth";

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{kicker}</p>
      <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(16,185,129,0.18),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
              {siteConfig.availability}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Hi, I&apos;m {siteConfig.name}.<br />
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Secure full-stack developer.
              </span>
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                View projects <ArrowRight size={15} />
              </a>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white transition hover:border-emerald-400"
              >
                <GithubIcon size={15} /> GitHub
              </a>
              <a
                href={siteConfig.cvUrl}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white transition hover:border-emerald-400"
              >
                <Download size={15} /> CV
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {siteConfig.location}</span>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1.5 hover:text-emerald-300">
                <Mail size={14} /> {siteConfig.email}
              </a>
              {siteConfig.phones.map((p) => (
                <a key={p.href} href={p.href} className="inline-flex items-center gap-1.5 hover:text-emerald-300">
                  <Phone size={14} /> {p.label}
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <ProfilePhoto />
            {[
              { icon: <ShieldCheck size={18} />, t: "Security-first", d: "OWASP-aware coding, auth hardening, input validation." },
              { icon: <Code2 size={18} />, t: "ASP.NET · C# · Python", d: "Back-end APIs plus Angular / JavaScript front-ends." },
              { icon: <Database size={18} />, t: "Databases", d: "SQL modelling, migrations, least-privilege access." },
            ].map((c) => (
              <div key={c.t} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  {c.icon}
                </span>
                <div>
                  <p className="font-medium text-white">{c.t}</p>
                  <p className="text-sm text-zinc-400">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" kicker="About" title="Cybersecurity student, building secure software">
        <p className="max-w-3xl leading-relaxed text-zinc-300">{siteConfig.about}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.quickFacts.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500">{k}</p>
              <p className="mt-0.5 text-sm font-medium text-zinc-100">{v}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" kicker="Skills" title="What I work with">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(siteConfig.skills).map(([group, items]) => (
            <div key={group} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <h3 className="font-semibold text-emerald-300">{group}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
                {(items as string[]).map((s) => (
                  <li key={s} className="flex gap-2"><span className="text-emerald-500">▸</span>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" kicker="Projects" title="Selected work — with live previews & files">
        <HomeProjects />
        <OwnerOnly>
          <p className="mt-4 text-sm text-zinc-500">
            Own this site? <Link href="/admin" className="text-emerald-300 underline">Add / edit projects here →</Link>
          </p>
        </OwnerOnly>
      </Section>

      {/* GITHUB */}
      <Section id="github" kicker="GitHub" title="Fresh from my repositories">
        <GithubRepos />
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" kicker="Experience" title="Where I've been">
        <div className="grid gap-4 lg:grid-cols-2">
          {siteConfig.experience.map((e) => (
            <div key={e.title} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
              <p className="text-xs text-emerald-300">{e.period}</p>
              <h3 className="mt-1 font-semibold text-white">{e.title}</h3>
              <p className="text-sm text-zinc-400">{e.org}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-zinc-300">
                {e.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" kicker="Contact" title="Contact me at">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3 text-zinc-100 transition hover:border-emerald-500/40 hover:text-emerald-200"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <Mail size={16} />
                </span>
                <span className="break-all">{siteConfig.email}</span>
              </a>
              {siteConfig.phones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3 text-zinc-100 transition hover:text-emerald-200"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
                    <Phone size={16} />
                  </span>
                  {p.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {siteConfig.phones.map((p) => (
                <a
                  key={p.wa}
                  href={`https://wa.me/${p.wa}?text=${encodeURIComponent("Hi Nyasha, I found your portfolio and would like to get in touch.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/20"
                >
                  <MessageCircle size={15} /> WhatsApp {p.label}
                </a>
              ))}
              <a href={siteConfig.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-emerald-400">
                <LinkedinIcon size={15} /> LinkedIn
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </main>
  );
}
