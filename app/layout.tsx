import type { Metadata } from "next";
import { Geist } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SchoolSoft+ Developer",
    template: "%s | SchoolSoft+ Developer",
  },
  description:
    "Explore the source and documentation behind SchoolSoft+, the independent student-built SchoolSoft dashboard.",
  keywords: ["SchoolSoft", "API", "documentation", "SchoolSoft+", "developer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NavBar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
