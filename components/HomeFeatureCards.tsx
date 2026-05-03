"use client";

import Link from "next/link";

function SignalIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01M7 20v-4M12 20V10M17 20V4M22 20h.01" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5M9 7V3M15 7V3M8 7h8a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4z" />
    </svg>
  );
}

const features = [
  {
    icon: <SignalIcon />,
    title: "SchoolSoft API Reference",
    description:
      "Unofficial, reverse-engineered documentation for SchoolSoft's internal REST and HTML-scraping APIs. Covers authentication, schedule, lunch, news, subjects, and more.",
    href: "/docs/schoolsoft-api",
    label: "View SchoolSoft API",
  },
  {
    icon: <PlugIcon />,
    title: "SchoolSoft+ Routes",
    description:
      "Full reference for all HTTP routes exposed by SchoolSoft+. Covers auth, academic data, social features, notes, countdowns, user search, and stats.",
    href: "/docs/ssp-routes",
    label: "View SSP+ Routes",
  },
];

export function HomeFeatureCards() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1rem",
        marginBottom: "3rem",
      }}
    >
      {features.map((f) => (
        <Link
          key={f.href}
          href={f.href}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            padding: "1.5rem",
            borderRadius: "8px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            transition: "border-color 0.15s, background 0.15s",
            gap: "1rem",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-border)";
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-raised)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface)";
          }}
        >
          {/* Icon container */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
            }}
          >
            {f.icon}
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              {f.title}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>
              {f.description}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--accent)",
              paddingTop: "0.25rem",
            }}
          >
            {f.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
