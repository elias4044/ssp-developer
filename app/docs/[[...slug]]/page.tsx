import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { DocSearch } from "@/components/DocSearch";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  docHref,
  docsSourceUrl,
  getDocContent,
  getDocsIndex,
  getHeadings,
  repositoryUrl,
  stripFrontmatter,
} from "@/lib/docs";

type PageProps = { params: Promise<{ slug?: string[] }> };
const legacySlugs = new Set([
  "ssp-node",
  "schoolsoft-api",
  "ssp-routes",
  "auth-v2",
]);

export const dynamic = "force-static";
export const revalidate = 300;

export async function generateStaticParams() {
  const index = await getDocsIndex();
  const slugs = new Set([
    ...legacySlugs,
    ...index.entries.map((entry) => entry.slug),
  ]);
  return [
    { slug: [] },
    ...Array.from(slugs, (slug) => ({ slug: slug.split("/") })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const index = await getDocsIndex();
  return {
    title:
      index.entries.find((entry) => entry.slug === slug?.join("/"))?.title ??
      "Documentation",
  };
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;
  const index = await getDocsIndex();
  const selected = index.entries.find(
    (entry) => entry.slug === slug?.join("/"),
  );
  if (
    slug &&
    !selected &&
    index.status !== "unavailable" &&
    !legacySlugs.has(slug.join("/"))
  )
    notFound();
  const rawContent =
    selected && index.revision
      ? await getDocContent(selected.path, index.revision)
      : null;
  const content = rawContent === null ? null : stripFrontmatter(rawContent);
  const headings = content ? getHeadings(content) : [];
  const groups = [...new Set(index.entries.map((entry) => entry.group))];
  const documentNavigation = (
    <nav aria-label="Documentation pages">
      {groups.map((group) => (
        <div key={group}>
          <p>{group}</p>
          {index.entries
            .filter((entry) => entry.group === group)
            .map((entry) => (
              <Link
                className="block"
                key={entry.path}
                href={docHref(entry.slug)}
                prefetch={true}
                aria-current={
                  entry.slug === selected?.slug ? "page" : undefined
                }
              >
                {entry.title}
              </Link>
            ))}
        </div>
      ))}
      {!index.entries.length && <p>Guides will appear here.</p>}
    </nav>
  );
  return (
    <main id="main-content" className="docs-shell frame">
      <aside className="docs-sidebar">
        <Link href="/docs">Documentation</Link>
        <div className="hidden md:block">{documentNavigation}</div>
        <details className="md:hidden">
          <summary>Browse the reference</summary>
          {documentNavigation}
        </details>
        <a
          href={index.status === "ready" ? docsSourceUrl : repositoryUrl}
          className="doc-source-link desktop-docs-source"
        >
          Source on GitHub <ArrowUpRight size={14} />
        </a>
      </aside>
      <div className="docs-main">
        <div className="docs-breadcrumb">
          <Link href="/">Developer</Link>
          <ChevronRight size={14} />
          <Link href="/docs">Docs</Link>
          {selected && (
            <>
              <ChevronRight size={14} />
              <span>{selected.title}</span>
            </>
          )}
        </div>
        {!selected ? (
          <>
            <h1>Documentation</h1>
            <p className="docs-lead">
              The reference for SchoolSoft+ lives with the application. Browse
              published guides or find a document by its title, topic, or file
              name.
            </p>
            {slug && (
              <p className="docs-lead">
                This reference has not been published at this address yet.
                Browse the available documentation below.
              </p>
            )}
            <DocSearch entries={index.entries} status={index.status} />
          </>
        ) : content === null ? (
          <>
            <h1>{selected.title}</h1>
            <p className="docs-lead">
              This document could not be loaded from GitHub. Try refreshing, or
              read it at the source.
            </p>
            <a
              href={`${repositoryUrl}/blob/main/${selected.path}`}
              className="primary-button"
            >
              Read on GitHub <ArrowUpRight size={16} />
            </a>
          </>
        ) : (
          <div className="reader-grid">
            <article>
              {!headings.some((heading) => heading.level === 1) && (
                <h1 className="doc-title">{selected.title}</h1>
              )}
              <MarkdownContent
                content={content}
                filePath={selected.path}
                entries={index.entries}
                revision={index.revision!}
              />
              <a
                className="doc-source-link"
                href={`${repositoryUrl}/blob/main/${selected.path}`}
              >
                Edit this page on GitHub <ArrowUpRight size={14} />
              </a>
            </article>
            <aside className="doc-toc">
              <span>On this page</span>
              <nav aria-label="On this page">
                {headings
                  .filter((heading) => heading.level > 1)
                  .map((heading) => (
                    <a href={`#${heading.id}`} key={heading.id}>
                      {heading.title}
                    </a>
                  ))}
              </nav>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
