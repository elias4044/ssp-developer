"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  catalogHref,
  docHref,
  getDocSections,
  matchesDoc,
  type DocEntry,
} from "@/lib/docs-shared";

export function DocNavigation({
  entries,
  selectedSlug,
}: {
  entries: DocEntry[];
  selectedSlug?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const selected = entries.find((entry) => entry.slug === selectedSlug);
  const section = selected?.section ?? "Guides";
  const areaEntries = entries.filter(
    (entry) => entry.section === section && !entry.overview,
  );
  const groups = [...new Set(areaEntries.map((entry) => entry.group))];
  const contextual =
    section === "Guides"
      ? areaEntries
      : areaEntries.filter((entry) => entry.group === selected?.group);
  return (
    <div className="doc-context-navigation">
      <label>
        Documentation area
        <select
          aria-label="Documentation area"
          value={section}
          onChange={(event) => router.push(catalogHref(event.target.value))}
        >
          {getDocSections(entries)
            .filter(
              (item) =>
                item.label !== "Other references" || item.label === section,
            )
            .map((item) => (
              <option key={item.label}>{item.label}</option>
            ))}
        </select>
      </label>
      {groups.length > 1 && (
        <label>
          Topic
          <select
            aria-label="Reference topic"
            value={selected?.group}
            onChange={(event) =>
              router.push(catalogHref(section, event.target.value))
            }
          >
            {groups.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </select>
        </label>
      )}
      <Link
        className="doc-context-back"
        href={section === "Other references" ? "/docs" : catalogHref(section)}
      >
        Browse {section.toLowerCase()}
      </Link>
      <h2>{section === "Guides" ? "In this section" : selected?.group}</h2>
      {contextual.length > 12 && (
        <input
          className="context-filter"
          aria-label="Filter this topic"
          placeholder="Find in this topic..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      )}
      <nav aria-label="Pages in this section">
        {contextual
          .filter((entry) => matchesDoc(entry, query))
          .map((entry) => (
            <Link
              href={docHref(entry.slug)}
              prefetch={true}
              key={entry.slug}
              aria-current={entry.slug === selectedSlug ? "page" : undefined}
            >
              {entry.title.replace(/^\/api\//, "/")}
            </Link>
          ))}
      </nav>
    </div>
  );
}
