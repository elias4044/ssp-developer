import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalogHref, docHref, type DocEntry } from "@/lib/docs-shared";
import { CodeBlock } from "@/components/CodeBlock";

export function DocsOverview({ entries }: { entries: DocEntry[] }) {
  const guides = entries.filter(
    (entry) => entry.section === "Guides" && !entry.overview,
  );
  const starters = [
    guides.find((entry) => entry.slug.endsWith("/architecture")),
    guides.find((entry) => entry.slug.endsWith("/authentication")),
    guides.find((entry) => entry.slug.endsWith("/worked-examples")),
  ].filter((entry): entry is DocEntry => !!entry);
  const topics = guides.filter((entry) => !starters.includes(entry));
  const apiCount = entries.filter(
    (entry) => entry.section === "API reference" && !entry.overview,
  ).length;
  const contractCount = entries.filter(
    (entry) => entry.section === "Source contracts" && !entry.overview,
  ).length;
  return (
    <div className="docs-welcome">
      <div className="docs-welcome-intro">
        <div>
          <h1>Build with SchoolSoft+</h1>
          <p>
            Understand how the backend works, make your first authenticated
            request, and find the contract behind every endpoint.
          </p>
          {starters[0] && (
            <Link href={docHref(starters[0].slug)} className="primary-button">
              Start with architecture <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <aside className="docs-reference-shortcuts">
          <h2>Go to the reference</h2>
          <Link href={catalogHref("API reference")}>
            <span>API reference</span>
            <span>
              {apiCount} endpoints <ArrowRight size={15} />
            </span>
          </Link>
          <Link href={catalogHref("Source contracts")}>
            <span>Source contracts</span>
            <span>
              {contractCount} shared modules <ArrowRight size={15} />
            </span>
          </Link>
          <a href="/llms.txt">
            <span>For AI agents</span>
            <span>
              Markdown index <ArrowRight size={15} />
            </span>
          </a>
        </aside>
      </div>
      <section className="docs-learning-path">
        <h2>Your first integration</h2>
        <p>
          Follow the request lifecycle, understand the credentials, then work
          through a complete example.
        </p>
        <div>
          {starters.map((entry) => (
            <Link href={docHref(entry.slug)} key={entry.slug}>
              <strong>{entry.title}</strong>
              <span>{entry.description}</span>
              <span className="docs-inline-action">
                Read the guide <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="docs-overview-example">
        <div>
          <h2>Know your session</h2>
          <p>
            Browser API requests use the app&apos;s authenticated cookies. Start
            by inspecting the current session, then follow the authentication
            guide for the full flow.
          </p>
          {starters[1] && (
            <Link href={docHref(starters[1].slug)}>
              Read about authentication <ArrowRight size={14} />
            </Link>
          )}
        </div>
        <CodeBlock>
          <code>
            {
              'const response = await fetch("/api/session", {\n  credentials: "include",\n});\n\nconst body = await response.json();\nif (!response.ok) {\n  throw new Error(body.error ?? "Request failed");\n}\n\nconsole.log(body.session.userId);'
            }
          </code>
        </CodeBlock>
      </section>
      <section className="docs-topic-guides">
        <h2>Explore the backend</h2>
        <div>
          {topics.map((entry) => (
            <Link href={docHref(entry.slug)} key={entry.slug}>
              <strong>{entry.title}</strong>
              <span>{entry.description}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="docs-agent-intro">
        <div>
          <h2>Bring your AI agent</h2>
          <p>
            Give your coding agent the documentation index, fetch a page as
            Markdown, or load the complete reference with its source revision.
          </p>
        </div>
        <div>
          <a href="/llms.txt">
            Read the agent index <ArrowRight size={15} />
          </a>
          <a href="/llms-full.txt">
            Open the full Markdown reference <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
