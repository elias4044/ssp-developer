"use client";
import { useState } from "react";
import { Check, Copy, GitBranch } from "lucide-react";
import {
  docsSourceUrl,
  repositoryUrl,
  type DocsIndex,
} from "@/lib/docs-shared";

const cloneCommand =
  "git clone https://github.com/elias4044/schoolsoftplus.git\ncd schoolsoftplus\nnpm install\nnpm run dev";

export function SourceTools({
  status,
  count,
  revision,
}: {
  status: DocsIndex["status"];
  count: number;
  revision?: string;
}) {
  const [copyState, setCopyState] = useState("Copy commands");
  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(cloneCommand);
      setCopyState("Copied");
    } catch {
      setCopyState("Select the commands to copy");
    }
  }
  return (
    <div className="source-tools">
      <div className="setup-fragment" data-ui>
        <div className="tool-heading">
          <span>Run it locally</span>
          <button onClick={copyCommands}>
            {copyState === "Copied" ? <Check size={16} /> : <Copy size={16} />}
            <span aria-live="polite">{copyState}</span>
          </button>
        </div>
        <pre>
          <code>{cloneCommand}</code>
        </pre>
        <p>
          Use Node.js and npm. Check the repository README for environment
          setup.
        </p>
      </div>
      <div className="status-fragment" data-ui>
        <div className="tool-heading">
          <span>Documentation source</span>
          <GitBranch size={17} />
        </div>
        <dl>
          <div>
            <dt>Repository</dt>
            <dd>elias4044/schoolsoftplus</dd>
          </div>
          <div>
            <dt>Branch</dt>
            <dd>main</dd>
          </div>
          <div>
            <dt>Directory</dt>
            <dd>docs/</dd>
          </div>
          <div>
            <dt>Documents</dt>
            <dd>
              {status === "unavailable"
                ? "Could not check"
                : count
                  ? `${count} published`
                  : "Not published yet"}
            </dd>
          </div>
          {revision && (
            <div>
              <dt>Revision</dt>
              <dd>
                <a
                  href={`https://github.com/elias4044/schoolsoftplus/commit/${revision}`}
                >
                  {revision.slice(0, 7)}
                </a>
              </dd>
            </div>
          )}
        </dl>
        <a href={status === "ready" ? docsSourceUrl : repositoryUrl}>
          Browse the source repository
        </a>
      </div>
    </div>
  );
}
