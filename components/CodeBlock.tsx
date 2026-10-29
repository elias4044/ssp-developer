"use client";
import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ children }: { children: ReactNode }) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [label, setLabel] = useState("Copy code");
  async function copyCode() {
    if (!codeRef.current) return;
    try {
      await navigator.clipboard.writeText(codeRef.current.textContent ?? "");
      setLabel("Copied");
    } catch {
      setLabel("Select code to copy");
    }
  }
  return (
    <div className="code-block">
      <button onClick={copyCode}>
        {label === "Copied" ? <Check size={15} /> : <Copy size={15} />}
        <span aria-live="polite">{label}</span>
      </button>
      <pre ref={codeRef}>{children}</pre>
    </div>
  );
}
