"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Search } from "lucide-react";
import {
  docHref,
  repositoryUrl,
  type DocEntry,
  type DocsIndex,
} from "@/lib/docs-shared";

export function DocSearch({
  entries,
  status,
  compact = false,
}: {
  entries: DocEntry[];
  status: DocsIndex["status"];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const matches = entries.filter((entry) =>
    `${entry.title} ${entry.group} ${entry.path}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const shown = compact && !query ? matches.slice(0, 6) : matches;
  return (
    <div className="doc-search" data-ui>
      <label className="search-field">
        <Search size={20} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a document..."
          aria-label="Find a document"
        />
        <span>Docs</span>
      </label>
      <div className="search-results" aria-live="polite">
        {status !== "ready" ? (
          <div className="empty-docs">
            <FileText size={28} strokeWidth={1.3} />
            <h3>
              {status === "empty"
                ? "The docs are on their way"
                : "The docs could not be loaded"}
            </h3>
            <p>
              {status === "empty"
                ? "The reference is being written. Published guides will appear here as they land in the SchoolSoft+ repository."
                : "GitHub is unavailable right now. Try again shortly, or browse the source directly."}
            </p>
            <a href={repositoryUrl}>
              Browse on GitHub <ArrowRight size={16} />
            </a>
            {status === "unavailable" && (
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            )}
          </div>
        ) : shown.length ? (
          <ul>
            {shown.map((entry) => (
              <li key={entry.path}>
                <Link href={docHref(entry.slug)} prefetch={true}>
                  <FileText size={18} />
                  <span>
                    <strong>{entry.title}</strong>
                    <span>{entry.group}</span>
                  </span>
                  <ArrowRight size={18} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-docs">
            <h3>No matching documents</h3>
            <p>Try a different title, topic, or file name.</p>
            <button onClick={() => setQuery("")} className="retry-button">
              Clear search
            </button>
          </div>
        )}
      </div>
      {compact && entries.length > 6 && (
        <Link href="/docs" className="all-docs">
          Browse all {entries.length} documents
        </Link>
      )}
    </div>
  );
}
