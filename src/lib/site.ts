// ─── Nyasha's portfolio config — edit freely ────────────────────────────
export const siteConfig = {
  name: "Nyasha Moreblessing Samson",
  firstName: "Nyasha",
  role: "Cybersecurity Student @ ZCAS University & IT Intern",
  tagline:
    "23 y/o from Zimbabwe — 3rd-year Cybersecurity student at ZCAS University, interning @ Shearwater Victoria Falls (IT Dept). I build with ASP.NET, Angular, Python, JavaScript & C#.",
  location: "Victoria Falls, Zimbabwe",
  email: "nyashamsamson@gmail.com",
  phones: [
    { label: "+263 773 447 241", href: "tel:+263773447241", wa: "263773447241" },
    { label: "+260 963 128 148", href: "tel:+260963128148", wa: "260963128148" },
  ],
  githubUsername: "NashMSam0", // ← used to auto-pull your repos
  githubUrl: "https://github.com/NashMSam0",
  linkedinUrl: "https://www.linkedin.com/in/your-handle",
  cvUrl: "/cv.pdf", // put your CV in public/cv.pdf
  profileImage: "/profile.jpg", // save your photo as public/profile.jpg
  url: "https://your-portfolio.vercel.app", // ← change to your real Vercel URL after deploy
  availability: "Open to 2026 internships & junior roles",
  about: `I'm Nyasha Moreblessing Samson, 23, born in Zimbabwe. I'm a 3rd-year Cybersecurity student at ZCAS University (2026) and did my high school at Christian Brothers College. I'm currently interning in the IT Department at Shearwater, Victoria Falls — a team specialising in software development and software security. My stack is ASP.NET, Angular, Python, JavaScript and C#, across front-end, back-end and databases, with a security-first mindset.`,
  quickFacts: [
    ["Age", "23"],
    ["Born", "Zimbabwe"],
    ["University", "ZCAS University — Cybersecurity"],
    ["High school", "Christian Brothers College"],
    ["Internship", "Shearwater, Victoria Falls (IT Dept)"],
    ["Stack", "ASP.NET · Angular · Python · JavaScript · C#"],
  ] as [string, string][],
  skills: {
    "Frontend": ["Angular", "JavaScript / TypeScript", "HTML & CSS", "Responsive UI"],
    "Backend": ["ASP.NET", "C#", "Python", "REST APIs"],
    "Security": ["OWASP Top 10 basics", "Secure auth & sessions", "Input validation", "SQLi / XSS prevention"],
    "Databases & Ops": ["SQL Server / MySQL", "PostgreSQL / SQLite", "Git & GitHub", "Linux basics"],
  },
  experience: [
    {
      title: "IT Intern — Software Development & Security",
      org: "Shearwater, Victoria Falls",
      period: "2026 — Present",
      points: [
        "Contribute to internal web apps across front-end (Angular), back-end (ASP.NET / Python) and databases.",
        "Apply secure-coding reviews: auth, validation, least-privilege DB access.",
        "Ship features with Git-based workflow and code review.",
      ],
    },
    {
      title: "Virtual Medication Officer",
      org: "Loving Angels Care — UK (Remote)",
      period: "6 months · Remote",
      points: [
        "Maintained accurate medication administration records and care documentation.",
        "Coordinated remotely with care staff to support safe, compliant medication handling.",
      ],
    },
    {
      title: "BSc Cybersecurity — Year 3",
      org: "ZCAS University",
      period: "2024 — Present",
      points: [
        "Coursework in networks, web security, databases and software engineering.",
        "Personal labs: vulnerability walkthroughs, hardening checklists, CTFs.",
      ],
    },
    {
      title: "High School",
      org: "Christian Brothers College",
      period: "Completed",
      points: ["Foundations in maths, science and computing before university."],
    },
  ],
};
