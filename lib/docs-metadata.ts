import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root, RootContent, PhrasingContent, Link } from "mdast";
import { getDocSections, type DocEntry } from "./docs-shared";

export function readableName(value: string) {
  const name = value
    .replace(/\.(md|mdx|tsx?)$/i, "")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function text(node: RootContent | PhrasingContent): string {
  if ("value" in node) return node.value;
  if ("children" in node)
    return node.children.map((child) => text(child as RootContent)).join("");
  return "";
}

function parse(content: string): Root {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(content.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, ""));
}

function findLink(node: RootContent): Link | undefined {
  if (node.type === "link") return node;
  if ("children" in node) {
    for (const child of node.children) {
      const link = findLink(child as RootContent);
      if (link) return link;
    }
  }
}

export function enrichDocsEntries(
  entries: DocEntry[],
  contents: Record<string, string>,
) {
  const result = entries.map((entry) => ({
    ...entry,
    section: entry.path.includes("/routes/")
      ? "API reference"
      : entry.path.includes("/contracts/")
        ? "Source contracts"
        : "Guides",
    group: entry.path.includes("/routes/")
      ? "Endpoints"
      : entry.path.includes("/contracts/")
        ? "Shared modules"
        : "Guides",
    overview: /(?:^|\/)(README|index)$/i.test(entry.slug),
  }));
  const byPath = new Map(result.map((entry) => [entry.path, entry]));
  const targetEntry = (href: string, filePath: string) => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return;
    const target = path.posix.normalize(
      path.posix.join(path.posix.dirname(filePath), href.split(/[?#]/, 1)[0]),
    );
    return (
      byPath.get(target) ??
      byPath.get(`${target.replace(/\/$/, "")}/README.md`) ??
      byPath.get(`${target.replace(/\/$/, "")}/index.md`)
    );
  };
  const documents = Object.entries(contents)
    .map(([filePath, content]) => ({ filePath, tree: parse(content) }))
    .sort(
      (a, b) => a.filePath.split("/").length - b.filePath.split("/").length,
    );
  for (const { filePath, tree } of documents) {
    const entry = byPath.get(filePath);
    if (!entry) continue;
    const heading = tree.children.find(
      (node) => node.type === "heading" && node.depth === 1,
    );
    const paragraph = tree.children.find((node) => node.type === "paragraph");
    if (heading) entry.title = text(heading);
    if (paragraph) entry.description = text(paragraph).slice(0, 260);
  }
  let order = 0;
  const indexes = documents.filter(({ filePath }) =>
    /(?:^|\/)(README|index)\.mdx?$/i.test(filePath),
  );
  for (const { filePath, tree } of indexes) {
    for (const node of tree.children) {
      if (node.type !== "list") continue;
      for (const item of node.children) {
        const paragraph = item.children.find(
          (child) => child.type === "paragraph",
        );
        if (!paragraph) continue;
        const link = findLink(paragraph);
        const entry = link && targetEntry(link.url, filePath);
        if (!entry || !link) continue;
        const label = text(link);
        if (entry.section === "Source contracts") {
          entry.title =
            label === "app/api/auth/v2/lib.ts"
              ? "AuthV2 helpers"
              : readableName(path.posix.basename(label));
          entry.description = `Shared types and functions from ${label}.`;
          entry.group = label.startsWith("app/api/lib/")
            ? "Backend helpers"
            : label.startsWith("app/api/auth/")
              ? "Authentication"
              : path.posix.dirname(label) === "lib"
                ? "Shared modules"
                : readableName(path.posix.basename(path.posix.dirname(label)));
        } else {
          entry.title = label;
          const description = text(paragraph)
            .slice(label.length)
            .replace(/^\s*:\s*/, "")
            .trim();
          if (description) entry.description = description;
          entry.order = order++;
        }
      }
    }
  }
  for (const { filePath, tree } of indexes) {
    for (const node of tree.children) {
      if (node.type !== "table") continue;
      for (const row of node.children.slice(1)) {
        const link = row.children[0] && findLink(row.children[0]);
        const entry = link && targetEntry(link.url, filePath);
        if (!entry || entry.section !== "API reference" || !link) continue;
        entry.title = text(link);
        entry.methods =
          (row.children[1] ? text(row.children[1]) : "").match(
            /\b(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g,
          ) ?? [];
        const guide = row.children[2] && findLink(row.children[2]);
        const domain = guide && targetEntry(guide.url, filePath);
        entry.group = domain?.title ?? "Endpoints";
        entry.description = `${entry.methods.join(", ")} endpoint. ${entry.group}.`;
      }
    }
  }
  for (const entry of result) {
    if (
      ["auth-v2", "ssp-routes"].includes(entry.slug) &&
      result.some((candidate) => candidate.slug.startsWith("backend/"))
    ) {
      entry.section = "Other references";
      entry.group = "Entry points";
    }
    if (entry.overview)
      entry.title =
        entry.slug === "README" ? "Overview" : `${entry.section} overview`;
  }
  const sectionRanks = getDocSections(result).map((section) => section.label);
  return result.sort(
    (a, b) =>
      sectionRanks.indexOf(a.section) - sectionRanks.indexOf(b.section) ||
      Number(b.overview) - Number(a.overview) ||
      (a.order ?? 10000) - (b.order ?? 10000) ||
      a.title.localeCompare(b.title),
  );
}
