import { cache } from "react";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { PhrasingContent } from "mdast";

import {
  repositoryUrl,
  docHref,
  type DocEntry,
  type DocsIndex,
} from "./docs-shared";
export {
  repositoryUrl,
  docsSourceUrl,
  docHref,
  type DocEntry,
  type DocsIndex,
} from "./docs-shared";
const apiUrl = "https://api.github.com/repos/elias4044/schoolsoftplus";

type TreeItem = { path: string; type: string };

export function humanize(value: string) {
  return value
    .replace(/\.(md|mdx)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function docSlug(filePath: string) {
  return filePath.replace(/^docs\//, "").replace(/\.(md|mdx)$/i, "");
}

export function createDocsIndex(
  items: TreeItem[],
  revision: string,
): DocsIndex {
  const entries = items
    .filter(
      (item) => item.type === "blob" && /^docs\/.+\.(md|mdx)$/i.test(item.path),
    )
    .map((item) => {
      const slug = docSlug(item.path);
      const parts = slug.split("/");
      return {
        path: item.path,
        slug,
        title: humanize(parts.at(-1)!),
        group: parts.length > 1 ? humanize(parts[0]) : "Documentation",
      };
    })
    .sort((a, b) => {
      const priority = (entry: DocEntry) =>
        /^(readme|index)$/i.test(entry.slug) ? -1 : 0;
      return priority(a) - priority(b) || a.path.localeCompare(b.path);
    });
  return { status: entries.length ? "ready" : "empty", entries, revision };
}

function requestOptions(revalidate: number | false = 300) {
  return {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate },
    signal: AbortSignal.timeout(8000),
  };
}

export const getDocsIndex = cache(async (): Promise<DocsIndex> => {
  try {
    const commitResponse = await fetch(
      `${apiUrl}/commits/main`,
      requestOptions(),
    );
    if (!commitResponse.ok)
      throw new Error(`GitHub returned ${commitResponse.status}`);
    const commit = await commitResponse.json();
    if (
      typeof commit.sha !== "string" ||
      typeof commit.commit?.tree?.sha !== "string"
    )
      throw new Error("Incomplete GitHub commit");
    const response = await fetch(
      `${apiUrl}/git/trees/${commit.commit.tree.sha}?recursive=1`,
      requestOptions(),
    );
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const data = await response.json();
    if (
      !Array.isArray(data.tree) ||
      data.truncated ||
      typeof data.sha !== "string"
    )
      throw new Error("Incomplete GitHub tree");
    return createDocsIndex(data.tree, commit.sha);
  } catch (error) {
    console.error(
      "Documentation index could not be loaded:",
      error instanceof Error ? error.message : error,
    );
    return { status: "unavailable", entries: [] };
  }
});

export const getDocContent = cache(
  async (filePath: string, revision: string): Promise<string | null> => {
    try {
      const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
      const response = await fetch(
        `https://raw.githubusercontent.com/elias4044/schoolsoftplus/${revision}/${encodedPath}`,
        requestOptions(false),
      );
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error(
        "Documentation page could not be loaded:",
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  },
);

export function resolveDocLink(
  href: string,
  filePath: string,
  entries: DocEntry[],
  revision: string,
  image = false,
) {
  if (
    !href ||
    href.startsWith("#") ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)
  )
    return href;
  const [target, fragment] = href.split("#", 2);
  const cleanTarget = target.split("?", 1)[0];
  let decodedTarget: string;
  try {
    decodedTarget = decodeURIComponent(cleanTarget);
  } catch {
    return href;
  }
  const resolved = decodedTarget.startsWith("/")
    ? path.posix.normalize(decodedTarget.slice(1))
    : path.posix.join(path.posix.dirname(filePath), decodedTarget);
  const entry = entries.find(
    (item) => item.path === resolved || item.slug === docSlug(resolved),
  );
  if (entry && !image)
    return `${docHref(entry.slug)}${fragment ? `#${fragment}` : ""}`;
  const encodedPath = resolved.split("/").map(encodeURIComponent).join("/");
  return image
    ? `https://raw.githubusercontent.com/elias4044/schoolsoftplus/${revision}/${encodedPath}`
    : `${repositoryUrl}/blob/${revision}/${encodedPath}${fragment ? `#${fragment}` : ""}`;
}

export function stripFrontmatter(content: string) {
  return content
    .replace(/^\uFEFF/, "")
    .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
}

export function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

export function getHeadings(content: string) {
  const headings: { title: string; id: string; level: number }[] = [];
  const counts = new Map<string, number>();
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  for (const node of tree.children) {
    if (node.type !== "heading") continue;
    const title = node.children.map(markdownText).join("");
    const base = headingId(title);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    if (node.depth <= 3)
      headings.push({
        title,
        id: count ? `${base}-${count}` : base,
        level: node.depth,
      });
  }
  return headings;
}

export function markdownText(node: PhrasingContent): string {
  if ("value" in node) return node.value;
  if ("children" in node) return node.children.map(markdownText).join("");
  if ("alt" in node) return node.alt ?? "";
  return "";
}
