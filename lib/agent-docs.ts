import {
  docHref,
  getDocSections,
  markdownHref,
  repositoryUrl,
  type DocEntry,
  type DocsIndex,
} from "./docs-shared";

export const docsOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://developer.ssp.elias4044.com"
).replace(/\/$/, "");

export function buildAgentIndex(index: DocsIndex, origin = docsOrigin) {
  const sections = getDocSections(index.entries);
  return [
    "# SchoolSoft+ Developer",
    "",
    "> Backend documentation for SchoolSoft+, an independent student-built interface for SchoolSoft.",
    "",
    `Source repository: ${repositoryUrl}`,
    `Source revision: ${index.revision}`,
    "",
    "Use the architecture and authentication guides before integrating. Prefer a specific Markdown document over loading the full reference. Examples may be illustrative; follow the implementation links in each document.",
    "",
    `- [Documentation overview](${origin}/docs): Reading paths and reference navigation.`,
    `- [Complete Markdown reference](${origin}/llms-full.txt): All documents from this source revision.`,
    "",
    ...sections.flatMap((section) => [
      `## ${section.label}`,
      "",
      ...section.entries.map(
        (entry) =>
          `- [${entry.title}](${origin}${markdownHref(entry.slug)}): ${entry.description ?? entry.group}`,
      ),
      "",
    ]),
  ].join("\n");
}

export function buildAgentDocument(
  entry: DocEntry,
  content: string,
  revision: string,
  origin = docsOrigin,
) {
  return [
    `<!-- Source revision: ${revision} -->`,
    `<!-- Read online: ${origin}${docHref(entry.slug)} -->`,
    `<!-- Source: ${repositoryUrl}/blob/${revision}/${entry.path} -->`,
    "",
    content,
  ].join("\n");
}
