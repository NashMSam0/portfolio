# Portfolio — Cybersecurity & Full-Stack (Next.js)

Personal portfolio for a 3rd-year Cybersecurity student / IT intern (Shearwater, Victoria Falls).
Post projects with **file uploads, website links, GitHub links, and automatic previews**.

## Run it

```bash
cd portfolio
npm install
npm run dev
```

Open http://localhost:3000

- `/` — Hero, About, Skills, Projects (search + filter), GitHub repos, Experience, Contact
- `/projects/[id]` — project detail: live website iframe + per-file previews
- `/admin` — add / edit / delete projects, upload files, export/import JSON

## Make it yours (5 min)

1. `src/lib/site.ts` — name, role, email, location, skills, experience, and:
   - `githubUsername` → your GitHub handle (auto-shows latest 6 repos)
   - `githubUrl`, `linkedinUrl`, `cvUrl` (drop your CV at `public/cv.pdf`)
2. `src/lib/seed.ts` — starter projects (shown on first load).
3. Run `npm run build` to verify.

## How project posting works

In `/admin`:

- **Title, summary, details, tags, category, featured flag**
- **GitHub URL** → repo button on the card + detail page
- **Live website URL** → “Live website” button + embedded iframe preview on the detail page
- **Cover image** → card thumbnail
- **Project files (upload)** → stored in the browser (localStorage) as data URLs:
  - `image/*` → image preview
  - `video/*` → video player
  - `audio/*` → audio player
  - PDF → embedded reader
  - code/text (js, ts, py, json, md, sql…) → code preview
  - zip/rar/7z/tar → download card (archives can't preview inline)
  - anything else → open/download card
- **Attach by URL** → for big files: put the file in `public/uploads/` (e.g. `public/uploads/demo.mp4`)
  and attach `/uploads/demo.mp4`. No size limit, works after deploy.

### Storage note

Browser localStorage is ~5MB per site — keep uploads under ~8MB each or use
`public/uploads/` + “attach by URL”. Use **Export JSON** in `/admin` to back up,
and paste it into `src/lib/seed.ts` to commit projects to git permanently.

## Profile photo

Save your photo as `public/profile.jpg` (JPG, upright, roughly square crops best).
Until then the hero shows your initials — no broken-image icon.

## Owner login (hide management from visitors)

The portfolio itself is fully public — no login needed to view it. Project
management is owner-only:

- A small **lock icon in the bottom-right corner** opens the password prompt.
  After unlocking it becomes a shortcut to `/admin`, and the **+ Add project**
  button, footer **Manage projects** link, and edit hints appear.
- Unlock lasts for the tab session; use **Lock** in `/admin` to log out.

Set your password in `.env.local` (already created, never committed):

```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your-secret-here
```

Then restart `npm run dev`. On Vercel, add the same variable under
Dashboard → project → Settings → Environment Variables, then redeploy.
Note: this is a static site, so the password is gatekeeping, not real
security — but visitors can't change your published content anyway (see below).

## Where data lives (Vercel)

Two kinds of data — don't mix them up:

1. **Published content (everyone with your link sees this):** the code,
   `src/lib/seed.ts` (project list), and files in `public/uploads/`. These
   deploy with the site, so anyone opening your Vercel URL loads the same
   thing. This is what recruiters see.
2. **Browser drafts (only you, only that browser):** anything added in
   `/admin` via upload is kept in that browser's localStorage for previewing.
   Other people will NOT see it until you publish it:

**Publish workflow (makes it visible to everyone):**

1. Put big files (screenshots, demo videos, PDFs, zips) in `public/uploads/`
   and attach them in `/admin` via **Attach by URL** (e.g. `/uploads/demo.mp4`).
2. In `/admin`, click **Export JSON**, copy the result.
3. Paste it into `src/lib/seed.ts` (replacing the array), commit + push.
4. Vercel redeploys automatically → share your link, it loads for everyone.

## Contact form (direct delivery, no mail app)

The form sends straight to `nyashamsamson@gmail.com` via Web3Forms (free):

1. Go to https://web3forms.com, enter your email, submit.
2. Click the verification link they email you → you get an access key.
3. Put it in `.env.local` as `NEXT_PUBLIC_WEB3FORMS_KEY`, restart `npm run dev`.
4. On Vercel, add the same variable under Settings → Environment Variables → redeploy.

Without a key, the form falls back to opening the visitor's mail app.

## Deploy

```bash
npm run build
```

Push to GitHub, then import into Vercel (or Netlify). In the host dashboard,
add `NEXT_PUBLIC_ADMIN_PASSWORD` and `NEXT_PUBLIC_WEB3FORMS_KEY` as
environment variables, then redeploy.
