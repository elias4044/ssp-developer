"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Search } from "lucide-react";
import {
  docHref,
  getDocSections,
  matchesDoc,
  repositoryUrl,
  type DocEntry,
  type DocsIndex,
} from "@/lib/docs-shared";

export function DocSearch({
  entries,
  status,
  compact = false,
  initialSection = "Guides",
  initialGroup = "",
  searchOnly = false,
  fixedSection = false,
}: {
  entries: DocEntry[];
  status: DocsIndex["status"];
  compact?: boolean;
  initialSection?: string;
  initialGroup?: string;
  searchOnly?: boolean;
  fixedSection?: boolean;
}) {
  const sections = getDocSections(entries);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState(initialSection);
  const [group, setGroup] = useState(initialGroup);
  const [method, setMethod] = useState("");
  const [limit, setLimit] = useState(16);
  const activeSection =
    sections.find((item) => item.label === section) ?? sections[0];
  const scoped =
    query.trim() && !fixedSection
      ? entries
      : (activeSection?.entries ?? []).filter((entry) => !entry.overview);
  const matches = scoped.filter(
    (entry) =>
      matchesDoc(entry, query) &&
      (!group || entry.group === group) &&
      (!method || entry.methods?.includes(method)),
  );
  const shown = matches.slice(0, compact ? 6 : limit);
  const groups = [
    ...new Set(
      (activeSection?.entries ?? [])
        .filter((entry) => !entry.overview)
        .map((entry) => entry.group),
    ),
  ];
  const overview = activeSection?.entries.find(
    (entry) => entry.overview && entry.slug !== "README",
  );
  return (
    <div className="doc-search" data-ui={compact ? true : undefined}>
      <label className="search-field">
        <Search size={20} />
        <input
          type="search"
          autoFocus={searchOnly}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setGroup(initialGroup);
            setMethod("");
            setLimit(16);
          }}
          placeholder={
            fixedSection
              ? `Search ${activeSection?.label.toLowerCase()}...`
              : "Search guides, endpoints, and contracts..."
          }
          aria-label={
            fixedSection
              ? `Search ${activeSection?.label.toLowerCase()}`
              : "Search all documentation"
          }
        />
        <span>Search</span>
      </label>
      {!compact && !searchOnly && status === "ready" && (
        <>
          {!fixedSection && (
            <div
              className="doc-category-tabs"
              aria-label="Documentation categories"
            >
              {sections.map((item) => (
                <button
                  key={item.label}
                  aria-pressed={!query && item.label === activeSection?.label}
                  onClick={() => {
                    setSection(item.label);
                    setQuery("");
                    setGroup("");
                    setMethod("");
                    setLimit(16);
                  }}
                >
                  {item.label}
                  <span>
                    {item.entries.filter((entry) => !entry.overview).length}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="doc-result-tools">
            <span aria-live="polite">
              {matches.length}{" "}
              {query
                ? "matching documents"
                : (activeSection?.label.toLowerCase() ?? "documents")}
            </span>
            {!query && groups.length > 1 && !initialGroup && (
              <label>
                <span className="sr-only">Filter by topic</span>
                <select
                  aria-label="Filter by topic"
                  value={group}
                  onChange={(event) => {
                    setGroup(event.target.value);
                    setLimit(16);
                  }}
                >
                  <option value="">All topics</option>
                  {groups.map((label) => (
                    <option key={label}>{label}</option>
                  ))}
                </select>
              </label>
            )}
            {!query && activeSection?.label === "API reference" && (
              <select
                aria-label="Filter by HTTP method"
                value={method}
                onChange={(event) => {
                  setMethod(event.target.value);
                  setLimit(16);
                }}
              >
                <option value="">All methods</option>
                {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]
                  .filter((method) =>
                    activeSection.entries.some((entry) =>
                      entry.methods?.includes(method),
                    ),
                  )
                  .map((value) => (
                    <option key={value}>{value}</option>
                  ))}
              </select>
            )}
            {!query && overview && (
              <Link href={docHref(overview.slug)}>
                Read the overview <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </>
      )}
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
                ? "Published guides will appear here as they land in the SchoolSoft+ repository."
                : "GitHub is unavailable right now. Try again shortly, or browse the source directly."}
            </p>
            <a href={repositoryUrl}>
              Browse on GitHub <ArrowRight size={16} />
            </a>
          </div>
        ) : searchOnly && !query.trim() ? (
          <div className="docs-search-help">
            <p>Search by topic, endpoint, HTTP method, or contract name.</p>
            <div>
              {["authentication", "/api/notes", "POST"].map((term) => (
                <button key={term} onClick={() => setQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : shown.length ? (
          <ul>
            {shown.map((entry) => (
              <li key={entry.path}>
                <Link href={docHref(entry.slug)} prefetch={true}>
                  <span className="doc-result-copy">
                    <span className="doc-result-meta">
                      {entry.section ?? "Guides"}
                      {entry.group !== entry.section ? ` / ${entry.group}` : ""}
                    </span>
                    <strong>{entry.title}</strong>
                    {entry.description && (
                      <span className="doc-result-description">
                        {entry.description}
                      </span>
                    )}
                    {!!entry.methods?.length && (
                      <span className="doc-methods">
                        {entry.methods.map((value) => (
                          <span key={value}>{value}</span>
                        ))}
                      </span>
                    )}
                  </span>
                  <ArrowRight size={18} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-docs">
            <h3>No matching documents</h3>
            <p>Try a topic, endpoint, HTTP method, or contract name.</p>
            <button
              className="retry-button"
              onClick={() => {
                setQuery("");
                setGroup("");
                setMethod("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {!compact &&
        (!searchOnly || !!query.trim()) &&
        matches.length > shown.length && (
          <button
            className="doc-show-more"
            onClick={() => setLimit(limit + 16)}
          >
            Show more ({matches.length - shown.length} remaining)
          </button>
        )}
      {compact && entries.length > 6 && (
        <Link href="/docs" className="all-docs">
          Browse documentation <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
