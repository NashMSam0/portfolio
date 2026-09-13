import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CornerLogin from "@/components/CornerLogin";
import { ProjectsProvider } from "@/lib/projects-store";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} — Cybersecurity & Full-Stack Portfolio`,
  description: siteConfig.tagline,
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} — Cybersecurity & Full-Stack Portfolio`,
    description: siteConfig.tagline,
    url: siteConfig.url,
    siteName: `${siteConfig.name} / portfolio`,
    type: "website",
    images: [{ url: siteConfig.profileImage, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} — Cybersecurity & Full-Stack Portfolio`,
    description: siteConfig.tagline,
  },
  alternates: { canonical: siteConfig.url },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.profileImage}`,
  jobTitle: siteConfig.role,
  address: { "@type": "PostalAddress", addressLocality: siteConfig.location },
  sameAs: [siteConfig.githubUrl, siteConfig.linkedinUrl],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100 antialiased">
        <ProjectsProvider>
          <AdminAuthProvider>
            <Navbar />
            {children}
            <Footer />
            <CornerLogin />
          </AdminAuthProvider>
        </ProjectsProvider>
      </body>
    </html>
  );
}
