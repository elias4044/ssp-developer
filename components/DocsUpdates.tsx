"use client";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkDocsUpdates } from "@/app/docs/actions";
import { repositoryUrl } from "@/lib/docs-shared";

export function DocsUpdates({
  revision,
  checkedAt,
}: {
  revision?: string;
  checkedAt?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  function checkUpdates() {
    startTransition(async () => {
      try {
        const result = await checkDocsUpdates();
        setMessage(
          result.status === "unavailable"
            ? "Could not check GitHub. Please try again."
            : result.revision === revision
              ? "You have the latest documentation."
              : "Documentation updated from GitHub.",
        );
        if (result.status !== "unavailable") router.refresh();
      } catch {
        setMessage("Could not check for updates. Please try again.");
      }
    });
  }
  return (
    <div className="docs-updates">
      <div className="docs-update-controls">
        <span title={checkedAt ? `Source checked ${checkedAt}` : undefined}>
          {revision ? (
            <a href={`${repositoryUrl}/commit/${revision}`}>
              GitHub revision {revision.slice(0, 7)}
            </a>
          ) : (
            "GitHub documentation"
          )}
        </span>
        <button disabled={pending} onClick={checkUpdates}>
          <RefreshCw
            size={14}
            className={pending ? "refresh-spinning" : undefined}
          />
          {pending ? "Checking..." : "Check for updates"}
        </button>
      </div>
      <p className="docs-update-message" role="status">
        {message}
      </p>
    </div>
  );
}
