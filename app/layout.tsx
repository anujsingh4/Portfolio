import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { EditProvider } from "@/context/EditContext";
import EditBar from "@/components/EditBar";

const font = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

const SITE_URL = "https://anujsingh.dev"; // update once you have a domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anuj Singh — Software Engineer",
    template: "%s | Anuj Singh",
  },
  description:
    "CS graduate from IIIT Nagpur. I build full-stack products, AI-powered tools, and clean systems that ship.",
  keywords: [
    "Anuj Singh",
    "software engineer",
    "full-stack developer",
    "AI engineer",
    "IIIT Nagpur",
    "React",
    "Next.js",
    "Python",
    "Django",
    "FastAPI",
  ],
  authors: [{ name: "Anuj Singh", url: SITE_URL }],
  creator: "Anuj Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Anuj Singh",
    title: "Anuj Singh — Software Engineer",
    description:
      "CS graduate from IIIT Nagpur. I build full-stack products, AI-powered tools, and clean systems that ship.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anuj Singh — Software Engineer",
    description:
      "CS graduate from IIIT Nagpur. I build full-stack products, AI-powered tools, and clean systems that ship.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.variable} font-space bg-bg text-text antialiased`}>
        <EditProvider>
          {children}
          <EditBar />
        </EditProvider>
      </body>
    </html>
  );
}
