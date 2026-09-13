import type { Project } from "./types";

/**
 * Seed projects — shown on first load.
 * To make them permanent, manage projects in /admin and click "Export JSON",
 * then paste the result here (or keep using the browser's localStorage).
 */
export const seedProjects: Project[] = [
  {
    id: "secure-task-manager",
    title: "Secure Task Manager — ASP.NET + Angular + Hardened Auth",
    summary:
      "ASP.NET + SQL task app with secure auth, role-based access and validation. My reference build for secure defaults.",
    details: `A full-stack task manager I use as my secure-coding reference:\n\n• ASP.NET auth, password hashing, lockout after failed logins\n• Server-side validation, parameterised SQL, CSRF protection\n• Rate limiting on auth routes, audit log table\n• Frontend: Angular, Backend: ASP.NET / C#, DB: SQL schema with migrations`,
    tags: ["ASP.NET", "Angular", "C#", "SQL", "OWASP"],
    category: "Security",
    githubUrl: "https://github.com/NashMSam0/secure-task-manager",
    liveUrl: "https://example.com",
    featured: true,
    createdAt: "2026-06-01T00:00:00.000Z",
    files: [],
  },
  {
    id: "vuln-lab-writeups",
    title: "Web Vulnerability Lab Write-ups",
    summary:
      "Documented walkthroughs: SQLi, XSS, IDOR and broken auth — each with vulnerable vs fixed code and a hardening checklist.",
    details: `Write-ups from my security labs. Each one covers:\n\n1. How to reproduce (in a legal lab environment)\n2. Root cause in code\n3. The fix (parameterised queries, output encoding, authz checks)\n4. Checklist so I don't ship the same bug\n\nUpload your PDF write-ups to this project via /admin — visitors can preview them inline.`,
    tags: ["Burp Suite", "SQLi", "XSS", "Write-ups"],
    category: "Security",
    githubUrl: "https://github.com/NashMSam0/security-writeups",
    createdAt: "2026-05-10T00:00:00.000Z",
    files: [],
  },
  {
    id: "shearwater-intern-portal",
    title: "Intern Portal (Shearwater IT) — Concept",
    summary:
      "Internal portal concept from my internship: tickets, asset tracking and role-based dashboards backed by a relational DB.",
    details: `Built during my internship at Shearwater Victoria Falls IT Dept:\n\n• Ticketing + asset tracking with SQL relational schema\n• Role-based UI (intern / admin), audit trail\n• REST API with validation, pagination and search\n\n(Details generalised — no internal/confidential data.)`,
    tags: ["Angular", "ASP.NET", "Python", "SQL", "REST"],
    category: "Web App",
    createdAt: "2026-08-01T00:00:00.000Z",
    files: [],
  },
];
