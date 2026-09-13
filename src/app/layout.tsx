import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CornerLogin from "@/components/CornerLogin";
import { ProjectsProvider } from "@/lib/projects-store";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Cybersecurity & Full-Stack Portfolio`,
  description: siteConfig.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
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
