"use client";
import { useCallback, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { DocSearch } from "@/components/DocSearch";
import type { DocEntry } from "@/lib/docs-shared";

export function DocsSearchDialog({ entries }: { entries: DocEntry[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openSearch = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  }, []);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);
  return (
    <>
      <button className="docs-search-trigger" onClick={openSearch}>
        <Search size={16} />
        <span>Search docs</span>
        <kbd>Ctrl K</kbd>
      </button>
      <dialog
        className="docs-search-dialog"
        ref={dialogRef}
        aria-labelledby="docs-search-title"
        onClick={(event) => {
          if (
            event.target === event.currentTarget ||
            (event.target as HTMLElement).closest("a")
          )
            dialogRef.current?.close();
        }}
      >
        <div className="docs-dialog-heading">
          <h2 id="docs-search-title">Search documentation</h2>
          <button
            aria-label="Close search"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <DocSearch entries={entries} status="ready" searchOnly />
      </dialog>
    </>
  );
}
