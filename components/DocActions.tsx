"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { markdownHref } from "@/lib/docs-shared";

export function DocActions({
  content,
  slug,
  revision,
}: {
  content: string;
  slug: string;
  revision: string;
}) {
  const [message, setMessage] = useState("");
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        menuRef.current.open = false;
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);
  async function copy(kind: "agent" | "markdown" | "link") {
    try {
      const text =
        kind === "agent"
          ? `Source page: ${location.href.split("#")[0]}\nSource revision: ${revision}\n\n${content}`
          : kind === "markdown"
            ? content
            : location.href;
      await navigator.clipboard.writeText(text);
      setMessage(kind === "link" ? "Link copied" : "Markdown copied");
      if (menuRef.current) menuRef.current.open = false;
    } catch {
      setMessage("Could not copy. Open the Markdown version instead.");
    }
  }
  return (
    <div className="doc-page-actions">
      <button onClick={() => copy("agent")}>
        {message === "Markdown copied" ? (
          <Check size={15} />
        ) : (
          <Copy size={15} />
        )}
        Copy for AI
      </button>
      <details
        ref={menuRef}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuRef.current)
            menuRef.current.open = false;
        }}
      >
        <summary>
          Page tools <ChevronDown size={14} />
        </summary>
        <div>
          <button onClick={() => copy("markdown")}>Copy Markdown</button>
          <button onClick={() => copy("link")}>Copy page link</button>
          <a href={markdownHref(slug)}>Open as Markdown</a>
          <a href="/llms.txt">AI agent index</a>
        </div>
      </details>
      <span role="status">{message}</span>
    </div>
  );
}
