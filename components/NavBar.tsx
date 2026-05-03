"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/docs/schoolsoft-api", label: "SchoolSoft API" },
  { href: "/docs/ssp-routes", label: "SSP+ Routes" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1.25rem",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "var(--foreground)",
              flexShrink: 0,
            }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span style={{ fontWeight: 600, fontSize: "0.9rem", letterSpacing: "-0.01em" }}>
              SchoolSoft+
            </span>
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                padding: "1px 5px",
                borderRadius: "3px",
                background: "var(--surface-raised)",
                color: "var(--muted)",
                border: "1px solid var(--border)",
                letterSpacing: "0.06em",
              }}
            >
              DEVELOPER
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}
            className="navbar-desktop"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "0.375rem 0.75rem",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: active ? "var(--foreground)" : "var(--muted)",
                    background: active ? "var(--surface-raised)" : "transparent",
                    borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div style={{ width: "1px", height: "16px", background: "var(--border)", margin: "0 0.375rem" }} />
            <a
              href="https://github.com/elias4044/schoolsoftplus"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              style={{
                padding: "0.375rem",
                borderRadius: "6px",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                transition: "color 0.12s, background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-raised)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              <GitHubIcon />
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="navbar-mobile-btn"
            style={{
              background: open ? "var(--surface-raised)" : "none",
              border: "1px solid",
              borderColor: open ? "var(--border)" : "transparent",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--foreground)",
              padding: "0.375rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.12s, border-color 0.12s",
            }}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M3 8h18M3 16h18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: "52px",
            zIndex: 90,
            background: "rgba(1,4,9,0.6)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        style={{
          position: "fixed",
          top: "52px",
          left: 0,
          right: 0,
          zIndex: 95,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          transform: open ? "translateY(0)" : "translateY(-6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform 0.15s ease, opacity 0.15s ease",
        }}
        className="navbar-mobile-drawer"
      >
        <div style={{ padding: "0.5rem 1rem 0.875rem", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.9375rem",
                  fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                  color: active ? "var(--foreground)" : "var(--muted)",
                  background: active ? "var(--surface-raised)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                }}
              >
                {link.label}
                {active && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </Link>
            );
          })}
          <div style={{ height: "1px", background: "var(--border)", margin: "0.25rem 0" }} />
          <a
            href="https://github.com/elias4044/schoolsoftplus"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.625rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.9375rem",
              fontWeight: 500,
              textDecoration: "none",
              color: "var(--muted)",
              borderLeft: "2px solid transparent",
            }}
          >
            <GitHubIcon />
            GitHub
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ marginLeft: "auto", opacity: 0.4 }}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .navbar-desktop { display: flex !important; }
          .navbar-mobile-btn { display: none !important; }
          .navbar-mobile-drawer { display: none !important; }
        }
        @media (max-width: 767px) {
          .navbar-desktop { display: none !important; }
          .navbar-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}