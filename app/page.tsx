import Link from "next/link";
import { HomeFeatureCards } from "@/components/HomeFeatureCards";

const quickLinks = [
  { label: "Authentication flow",   href: "/docs/schoolsoft-api#authentication" },
  { label: "Session cookie format", href: "/docs/schoolsoft-api#session-cookies" },
  { label: "Schedule endpoint",     href: "/docs/schoolsoft-api#schedule" },
  { label: "POST /api/login",       href: "/docs/ssp-routes#login" },
  { label: "Conversations",         href: "/docs/ssp-routes#conversations" },
  { label: "Notes CRUD",            href: "/docs/ssp-routes#notes" },
];

const externalLinks = [
  { label: "Live site", href: "https://ssp.elias4044.com" },
  { label: "GitHub",    href: "https://github.com/elias4044/schoolsoftplus" },
  { label: "Stats",     href: "https://ssp.elias4044.com/stats" },
];

function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>

      {/*  Hero  */}
      <div style={{ maxWidth: "680px", marginBottom: "3.5rem" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "6px",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            fontWeight: 500,
            marginBottom: "1.5rem",
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          SchoolSoft+ · Developer Documentation
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.875rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.035em",
            color: "var(--foreground)",
            marginBottom: "1.25rem",
          }}
        >
          Build on top of{" "}
          <span style={{ color: "var(--foreground)" }}>
            SchoolSoft
          </span>
        </h1>

        <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "580px", marginBottom: "0.875rem" }}>
          Welcome to <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>SchoolSoft+ Developer</strong> — the
          central reference for all documentation related to SchoolSoft+ and the underlying SchoolSoft platform.
        </p>
        <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "580px" }}>
          SchoolSoft+ is an independent, open-source web app that gives your existing SchoolSoft account a
          dramatically better interface. This site documents both SchoolSoft&apos;s unofficial API (reverse-engineered
          from the platform) and every route exposed by SchoolSoft+ itself — with request/response examples,
          parameter tables, and auth model explanations.
        </p>
      </div>

      {/*  Doc cards (Client Component — hover effects)  */}
      <HomeFeatureCards />

      {/*  Quick links  */}
      <div style={{ marginBottom: "3.5rem" }}>
        <h2
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: "0.875rem",
            letterSpacing: "-0.01em",
          }}
        >
          Quick links
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "0.625rem 0.875rem",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                fontSize: "0.875rem",
                color: "var(--muted)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--surface)",
              }}
            >
              <span style={{ color: "var(--accent)", display: "flex", flexShrink: 0 }}>
                <ChevronRight />
              </span>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/*  About  */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "8px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          maxWidth: "720px",
        }}
      >
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
          About SchoolSoft+
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>
          <p style={{ margin: 0 }}>
            SchoolSoft+ is a fast, modern, AI-powered dashboard for SchoolSoft built by a student, for students.
            It proxies SchoolSoft&apos;s login flow on your behalf and never stores your password — credentials are
            forwarded directly to SchoolSoft over HTTPS and immediately discarded.
          </p>
          <p style={{ margin: 0 }}>
            The platform adds real-time messaging with end-to-end encryption, a friends system, an AI assistant
            (Google Gemini) with full schedule and assignment context, drag-and-drop dashboard widgets, rich-text
            notes with public share links, and much more.
          </p>
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", paddingTop: "0.375rem" }}>
            {externalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {l.label}
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
