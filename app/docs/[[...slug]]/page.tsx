import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { DocSearch } from "@/components/DocSearch";
import { MarkdownContent } from "@/components/MarkdownContent";
import { DocNavigation } from "@/components/DocNavigation";
import { DocsUpdates } from "@/components/DocsUpdates";
import { DocsHeader } from "@/components/DocsHeader";
import { DocsOverview } from "@/components/DocsOverview";
import { DocActions } from "@/components/DocActions";
import {
  catalogHref,
  getCatalogView,
  getDocSections,
  markdownHref,
} from "@/lib/docs-shared";
import { docsOrigin } from "@/lib/agent-docs";
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
export const dynamicParams = true;
// Refresh rendered pages more often than the shared five-minute source snapshot.
export const revalidate = 60;

export async function generateStaticParams() {
  const index = await getDocsIndex();
  const slugs = new Set([
    ...legacySlugs,
    ...index.entries.map((entry) => entry.slug),
    ...getDocSections(index.entries)
      .filter((section) => section.label !== "Other references")
      .flatMap((section) => [
        catalogHref(section.label),
        ...new Set(
          section.entries
            .filter((entry) => !entry.overview)
            .map((entry) => catalogHref(section.label, entry.group)),
        ),
      ])
      .map((href) => href.replace("/docs/", "")),
  ]);
  return [
    { slug: [] },
    ...Array.from(slugs, (slug) => ({ slug: slug.split("/") })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const index = await getDocsIndex();
  const selected = index.entries.find(
    (entry) => entry.slug === slug?.join("/"),
  );
  const catalog = getCatalogView(slug?.join("/"), index.entries);
  return {
    title: selected?.title ?? catalog?.title ?? "Documentation",
    alternates: {
      types: selected
        ? { "text/markdown": `${docsOrigin}${markdownHref(selected.slug)}` }
        : { "text/plain": `${docsOrigin}/llms.txt` },
    },
  };
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;
  const index = await getDocsIndex();
  const selected = index.entries.find(
    (entry) => entry.slug === slug?.join("/"),
  );
  const catalog = !selected
    ? getCatalogView(slug?.join("/"), index.entries)
    : undefined;
  if (
    slug &&
    !selected &&
    !catalog &&
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
  const documentNavigation = (
    <DocNavigation entries={index.entries} selectedSlug={selected?.slug} />
  );
  const siblings = selected
    ? index.entries.filter(
        (entry) =>
          entry.section === selected.section &&
          entry.group === selected.group &&
          !entry.overview,
      )
    : [];
  const currentPosition = siblings.findIndex(
    (entry) => entry.slug === selected?.slug,
  );
  const previous =
    currentPosition > 0 ? siblings[currentPosition - 1] : undefined;
  const next = currentPosition >= 0 ? siblings[currentPosition + 1] : undefined;
  const sectionOverview =
    selected &&
    index.entries.find(
      (entry) => entry.section === selected.section && entry.overview,
    );
  return (
    <main id="main-content" className="docs-page frame">
      <DocsHeader entries={index.entries} />
      <div className={selected ? "docs-reader" : "docs-home"}>
        {selected && (
          <aside className="docs-sidebar">
            {documentNavigation}
            <a
              href={index.status === "ready" ? docsSourceUrl : repositoryUrl}
              className="doc-source-link desktop-docs-source"
            >
              Source on GitHub <ArrowUpRight size={14} />
            </a>
          </aside>
        )}
        <div className="docs-main">
          <DocsUpdates revision={index.revision} checkedAt={index.checkedAt} />
          <div className="docs-breadcrumb">
            <Link href="/">Developer</Link>
            <ChevronRight size={14} />
            <Link href="/docs">Docs</Link>
            {selected && (
              <>
                <ChevronRight size={14} />
                <Link
                  href={
                    sectionOverview ? docHref(sectionOverview.slug) : "/docs"
                  }
                >
                  {selected.section ?? selected.group}
                </Link>
                <ChevronRight size={14} />
                <span>{selected.title}</span>
              </>
            )}
            {catalog && (
              <>
                <ChevronRight size={14} />
                <span>{catalog.title}</span>
              </>
            )}
          </div>
          {!selected ? (
            <>
              {catalog ? (
                <>
                  <h1>{catalog.title}</h1>
                  <p className="docs-lead">
                    {catalog.section === "API reference"
                      ? "Find the route, narrow by HTTP method, and open its request examples and source contract."
                      : catalog.section === "Source contracts"
                        ? "Look up the types, validation rules, and helper functions behind the backend."
                        : "Understand the request lifecycle and follow the guides for each part of the backend."}
                  </p>
                  <DocSearch
                    key={`${catalog.section}/${catalog.group}`}
                    entries={index.entries}
                    status={index.status}
                    initialSection={catalog.section}
                    initialGroup={catalog.group}
                    fixedSection
                  />
                </>
              ) : index.status === "ready" ? (
                <DocsOverview entries={index.entries} />
              ) : (
                <>
                  <h1>Documentation</h1>
                  <DocSearch entries={index.entries} status={index.status} />
                </>
              )}
              {slug && !catalog && (
                <p className="docs-lead">
                  This reference has not been published at this address yet.
                  Browse the available documentation below.
                </p>
              )}
            </>
          ) : content === null ? (
            <>
              <h1>{selected.title}</h1>
              <p className="docs-lead">
                This document could not be loaded from GitHub. Try refreshing,
                or read it at the source.
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
                <DocActions
                  content={content}
                  slug={selected.slug}
                  revision={index.revision!}
                />
                {headings.some((heading) => heading.level > 1) && (
                  <details className="mobile-doc-toc">
                    <summary>On this page</summary>
                    <nav aria-label="On this page on mobile">
                      {headings
                        .filter((heading) => heading.level > 1)
                        .map((heading) => (
                          <a href={`#${heading.id}`} key={heading.id}>
                            {heading.title}
                          </a>
                        ))}
                    </nav>
                  </details>
                )}
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
                {(previous || next) && (
                  <nav
                    className="doc-pagination"
                    aria-label="Adjacent documents"
                  >
                    {previous ? (
                      <Link href={docHref(previous.slug)} prefetch={true}>
                        <span>Previous</span>
                        <strong>{previous.title}</strong>
                      </Link>
                    ) : (
                      <span />
                    )}
                    {next && (
                      <Link href={docHref(next.slug)} prefetch={true}>
                        <span>Next</span>
                        <strong>{next.title}</strong>
                      </Link>
                    )}
                  </nav>
                )}
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
      </div>
    </main>
  );
}
