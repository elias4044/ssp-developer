"use client";

import { useState } from "react";

/* --- Method Badge - */
const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GET:    { bg: "var(--green-subtle)",  text: "var(--green)",  border: "rgba(63,185,80,0.2)" },
  POST:   { bg: "var(--blue-subtle)",   text: "var(--blue)",   border: "rgba(88,166,255,0.2)" },
  PUT:    { bg: "var(--yellow-subtle)", text: "var(--yellow)", border: "rgba(210,153,34,0.2)" },
  PATCH:  { bg: "var(--orange-subtle)", text: "var(--orange)", border: "rgba(240,136,62,0.2)" },
  DELETE: { bg: "var(--red-subtle)",    text: "var(--red)",    border: "rgba(248,81,73,0.2)" },
};

export function MethodBadge({ method }: { method: string }) {
  const c = METHOD_COLORS[method] ?? { bg: "var(--accent-subtle)", text: "var(--accent)", border: "var(--accent-border)" };
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.6875rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        padding: "2px 7px",
        borderRadius: "4px",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontFamily: "var(--font-geist-mono, monospace)",
        flexShrink: 0,
      }}
    >
      {method}
    </span>
  );
}

/* --- Code Block with copy ----------------------------------- */
export function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#090d13",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
        margin: "0.75rem 0 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.375rem 0.875rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--surface)",
        }}
      >
        <span
          style={{
            fontSize: "0.6875rem",
            color: "var(--muted-fg)",
            fontFamily: "var(--font-geist-mono, monospace)",
            fontWeight: 500,
            letterSpacing: "0.03em",
          }}
        >
          {language}
        </span>
        <button
          onClick={copy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            background: "none",
            border: "1px solid",
            borderColor: copied ? "rgba(63,185,80,0.3)" : "var(--border)",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "0.6875rem",
            cursor: "pointer",
            color: copied ? "var(--green)" : "var(--muted)",
            transition: "color 0.15s, border-color 0.15s",
          }}
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "1rem 1rem",
          overflowX: "auto",
          fontSize: "0.8125rem",
          lineHeight: 1.75,
          fontFamily: "var(--font-geist-mono, monospace)",
          color: "#adbac7",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* --- Endpoint Card ------------------------------------------ */
export function EndpointCard({
  method,
  path,
  description,
  auth = true,
  children,
}: {
  method: string;
  path: string;
  description: string;
  auth?: boolean;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pathCopied, setPathCopied] = useState(false);

  const copyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setPathCopied(true);
    setTimeout(() => setPathCopied(false), 2000);
  };

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "0.75rem",
        background: "var(--surface)",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: "100%",
          padding: "0.75rem 1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <MethodBadge method={method} />
        <code
          style={{
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: "0.8125rem",
            color: "var(--foreground)",
            fontWeight: 400,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {path}
        </code>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
          {!auth && (
            <span
              style={{
                fontSize: "0.625rem",
                padding: "1px 6px",
                borderRadius: "3px",
                background: "var(--yellow-subtle)",
                color: "var(--yellow)",
                border: "1px solid rgba(210,153,34,0.2)",
                whiteSpace: "nowrap",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              NO AUTH
            </span>
          )}
          {/* Copy path button */}
          <span
            role="button"
            onClick={copyPath}
            title="Copy path"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "26px",
              height: "26px",
              borderRadius: "4px",
              color: pathCopied ? "var(--green)" : "var(--muted-fg)",
              border: "1px solid",
              borderColor: pathCopied ? "rgba(63,185,80,0.3)" : "transparent",
              background: "none",
              transition: "color 0.15s, border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!pathCopied) {
                (e.currentTarget as HTMLSpanElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLSpanElement).style.background = "var(--surface-raised)";
                (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--border)";
              }
            }}
            onMouseLeave={(e) => {
              if (!pathCopied) {
                (e.currentTarget as HTMLSpanElement).style.color = "var(--muted-fg)";
                (e.currentTarget as HTMLSpanElement).style.background = "none";
                (e.currentTarget as HTMLSpanElement).style.borderColor = "transparent";
              }
            }}
          >
            {pathCopied ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
            )}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            style={{
              color: "var(--muted-fg)",
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {open && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1.125rem 1rem 1rem",
          }}
        >
          <p style={{ margin: "0 0 1rem", color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>
            {description}
          </p>
          {children}
        </div>
      )}
    </div>
  );
}

/* --- Parameter Table ---------------------------------------- */
export function ParamTable({
  title = "Parameters",
  rows,
}: {
  title?: string;
  rows: { name: string; type: string; required: boolean; description: string }[];
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p
        style={{
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--muted-fg)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </p>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "6px",
          overflow: "hidden",
          fontSize: "0.8125rem",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
            <thead>
              <tr style={{ background: "var(--surface-raised)", textAlign: "left" }}>
                {["Name", "Type", "Required", "Description"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.4375rem 0.75rem",
                      fontWeight: 600,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.04em",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <td style={{ padding: "0.5rem 0.75rem", whiteSpace: "nowrap" }}>
                    <code
                      style={{
                        fontFamily: "var(--font-geist-mono, monospace)",
                        color: "var(--accent)",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {row.name}
                    </code>
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", whiteSpace: "nowrap" }}>
                    <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--muted)", fontSize: "0.8125rem" }}>
                      {row.type}
                    </code>
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", whiteSpace: "nowrap" }}>
                    {row.required ? (
                      <span style={{ color: "var(--red)", fontWeight: 600, fontSize: "0.75rem" }}>Yes</span>
                    ) : (
                      <span style={{ color: "var(--muted-fg)", fontSize: "0.75rem" }}>No</span>
                    )}
                  </td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)", lineHeight: 1.5 }}>
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- Section Heading with anchor copy ---------------------- */
export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const copyAnchor = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <h2
      id={id}
      style={{
        scrollMarginTop: "72px",
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "var(--foreground)",
        margin: "2.5rem 0 0.75rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {children}
      <button
        onClick={copyAnchor}
        title="Copy link to section"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: copied ? "var(--green)" : "var(--muted-fg)",
          padding: "2px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          opacity: 0.6,
          transition: "color 0.15s, opacity 0.15s",
          fontSize: "inherit",
          fontWeight: "inherit",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.6"; }}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5" /></svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        )}
      </button>
    </h2>
  );
}

/* --- Sub-section Heading ------------------------------------ */
export function SubHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      style={{
        scrollMarginTop: "72px",
        fontSize: "1rem",
        fontWeight: 600,
        color: "var(--foreground)",
        margin: "1.75rem 0 0.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span style={{ color: "var(--muted-fg)", fontWeight: 400 }}>#</span>
      {children}
    </h3>
  );
}

/* --- Callout ------ */
function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
      <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    info:    { bg: "transparent", borderLeft: "var(--accent)", icon: "var(--accent)" },
    warning: { bg: "transparent", borderLeft: "var(--yellow)", icon: "var(--yellow)" },
    danger:  { bg: "transparent", borderLeft: "var(--red)",    icon: "var(--red)" },
  }[type];

  const Icon = type === "info" ? InfoIcon : type === "warning" ? WarningIcon : DangerIcon;

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        background: "var(--surface-raised)",
        borderLeft: `3px solid ${styles.borderLeft}`,
        borderRadius: "0 6px 6px 0",
        margin: "1rem 0",
        fontSize: "0.875rem",
        lineHeight: 1.65,
        color: "var(--foreground)",
      }}
    >
      <span style={{ color: styles.icon, display: "flex", flexShrink: 0 }}>
        <Icon />
      </span>
      <div style={{ color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

