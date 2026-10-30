"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  catalogHref,
  docHref,
  getDocSections,
  type DocEntry,
} from "@/lib/docs-shared";
import { DocsSearchDialog } from "@/components/DocsSearchDialog";

export function DocsHeader({ entries }: { entries: DocEntry[] }) {
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    function closeMenus(event: PointerEvent | KeyboardEvent) {
      if (event.type === "keydown" && (event as KeyboardEvent).key !== "Escape")
        return;
      if (
        event.type === "pointerdown" &&
        headerRef.current?.contains(event.target as Node)
      )
        return;
      headerRef.current
        ?.querySelectorAll<HTMLDetailsElement>("details[open]")
        .forEach((menu) => {
          menu.open = false;
        });
    }
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeMenus);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeMenus);
    };
  }, []);
  return (
    <header className="docs-header" ref={headerRef}>
      <nav aria-label="Documentation sections">
        <Link href="/docs" className="docs-overview-link">
          Overview
        </Link>
        {getDocSections(entries)
          .filter((section) => section.label !== "Other references")
          .map((section) => {
            const groups = [
              ...new Set(
                section.entries
                  .filter((entry) => !entry.overview)
                  .map((entry) => entry.group),
              ),
            ];
            return (
              <details
                className="docs-section-dropdown"
                key={section.label}
                onToggle={(event) => {
                  if (event.currentTarget.open)
                    headerRef.current
                      ?.querySelectorAll<HTMLDetailsElement>("details[open]")
                      .forEach((menu) => {
                        if (menu !== event.currentTarget) menu.open = false;
                      });
                }}
              >
                <summary>
                  {section.label}
                  <ChevronDown size={14} />
                </summary>
                <div
                  className="docs-section-menu"
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest("a"))
                      event.currentTarget.closest("details")!.open = false;
                  }}
                >
                  <Link
                    className="docs-menu-overview"
                    href={catalogHref(section.label)}
                  >
                    Browse {section.label.toLowerCase()}
                  </Link>
                  <div className="docs-menu-links">
                    {section.label === "Guides"
                      ? section.entries
                          .filter((entry) => !entry.overview)
                          .map((entry) => (
                            <Link href={docHref(entry.slug)} key={entry.slug}>
                              <strong>{entry.title}</strong>
                              <span>{entry.description}</span>
                            </Link>
                          ))
                      : groups.map((group) => (
                          <Link
                            href={catalogHref(section.label, group)}
                            key={group}
                          >
                            <strong>{group}</strong>
                            <span>
                              {
                                section.entries.filter(
                                  (entry) =>
                                    entry.group === group && !entry.overview,
                                ).length
                              }{" "}
                              {section.label === "API reference"
                                ? "endpoints"
                                : "contracts"}
                            </span>
                          </Link>
                        ))}
                  </div>
                </div>
              </details>
            );
          })}
      </nav>
      <DocsSearchDialog entries={entries} />
    </header>
  );
}
