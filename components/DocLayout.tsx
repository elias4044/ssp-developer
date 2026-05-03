"use client";

import { useState, useEffect, useCallback } from "react";

export type SidebarSection = {
  title: string;
  items: { id: string; label: string; badge?: string }[];
};

interface DocLayoutProps {
  sections: SidebarSection[];
  children: React.ReactNode;
}

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  GET:    { bg: "var(--green-subtle)",  color: "var(--green)" },
  POST:   { bg: "var(--blue-subtle)",   color: "var(--blue)" },
  PUT:    { bg: "var(--yellow-subtle)", color: "var(--yellow)" },
  PATCH:  { bg: "var(--orange-subtle)", color: "var(--orange)" },
  DELETE: { bg: "var(--red-subtle)",    color: "var(--red)" },
};

export default function DocLayout({ sections, children }: DocLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Flatten all section item IDs
  const allIds = sections.flatMap((s) => s.items.map((i) => i.id));

  // IntersectionObserver to track active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  }, []);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const SidebarContent = () => (
    <nav aria-label="Page sections">
      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: "1.75rem" }}>
          <div
            style={{
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-fg)",
              padding: "0 0.625rem",
              marginBottom: "0.375rem",
            }}
          >
            {section.title}
          </div>
          {section.items.map((item) => {
            const active = activeId === item.id;
            const bc = item.badge ? (BADGE_COLORS[item.badge] ?? { bg: "var(--accent-subtle)", color: "var(--accent)" }) : null;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.3125rem 0.625rem",
                  borderRadius: "5px",
                  fontSize: "0.8125rem",
                  color: active ? "var(--foreground)" : "var(--muted)",
                  background: active ? "var(--surface-raised)" : "none",
                  border: "none",
                  borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "color 0.12s, background 0.12s",
                  fontWeight: active ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                    (e.currentTarget as HTMLButtonElement).style.background = "none";
                  }
                }}
              >
                <span>{item.label}</span>
                {bc && (
                  <span
                    style={{
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                      padding: "1px 4px",
                      borderRadius: "3px",
                      background: bc.bg,
                      color: bc.color,
                      letterSpacing: "0.04em",
                      fontFamily: "var(--font-geist-mono, monospace)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div style={{ display: "flex", flex: 1, alignItems: "stretch", minHeight: 0 }}>
      {/* Desktop sidebar */}
      <aside
        className="doc-sidebar"
        style={{
          width: "240px",
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "var(--surface)",
          alignSelf: "stretch",
        }}
      >
        {/* Sticky inner wrapper */}
        <div
          style={{
            position: "sticky",
            top: "52px",
            maxHeight: "calc(100vh - 52px)",
            overflowY: "auto",
            padding: "1.25rem 0.75rem",
          }}
        >
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile: top bar with toggle */}
      <div
        className="doc-mobile-bar"
        style={{
          position: "fixed",
          top: "52px",
          left: 0,
          right: 0,
          zIndex: 30,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "0.375rem 0.75rem",
            fontSize: "0.8125rem",
            color: "var(--muted)",
            cursor: "pointer",
          }}
          aria-label="Open navigation"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M3 8h18M3 16h18" />
          </svg>
          On this page
        </button>
        {activeId && (
          <span style={{ fontSize: "0.8125rem", color: "var(--muted-fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {sections.flatMap((s) => s.items).find((i) => i.id === activeId)?.label ?? ""}
          </span>
        )}
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 45,
            background: "rgba(1,4,9,0.65)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "272px",
          zIndex: 50,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: "1rem 0.75rem",
          overflowY: "auto",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
        className="doc-mobile-drawer"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", padding: "0 0.125rem" }}>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>On this page</span>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: "5px", cursor: "pointer", color: "var(--muted)", padding: "0.25rem 0.375rem", display: "flex" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "2rem 2rem 5rem",
          maxWidth: "860px",
        }}
        className="doc-main"
      >
        {children}
      </main>

      <style>{`
        @media (min-width: 768px) {
          .doc-sidebar { display: block !important; }
          .doc-mobile-bar { display: none !important; }
          .doc-mobile-drawer { display: none !important; }
        }
        @media (max-width: 767px) {
          .doc-sidebar { display: none !important; }
          .doc-mobile-bar { display: flex !important; }
          .doc-main { padding-top: 3.5rem !important; }
        }
      `}</style>
    </div>
  );
}

