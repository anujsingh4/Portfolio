import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "All projects by Anuj Singh — full-stack products, AI tools, and systems built with React, Next.js, Django, FastAPI, and more.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
