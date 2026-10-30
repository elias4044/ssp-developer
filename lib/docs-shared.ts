export const repositoryUrl = "https://github.com/elias4044/schoolsoftplus";
export const docsSourceUrl = `${repositoryUrl}/tree/main/docs`;
export type DocEntry = {
  path: string;
  slug: string;
  title: string;
  group: string;
  section?: string;
  description?: string;
  methods?: string[];
  order?: number;
  overview?: boolean;
};
export type DocsIndex = {
  status: "ready" | "empty" | "unavailable";
  entries: DocEntry[];
  revision?: string;
  checkedAt?: string;
};
export const sectionOrder = [
  "Guides",
  "API reference",
  "Source contracts",
  "Other references",
];

export function getDocSections(entries: DocEntry[]) {
  const labels = [
    ...new Set(entries.map((entry) => entry.section ?? "Guides")),
  ];
  return labels
    .sort((a, b) => {
      const rank = (label: string) =>
        sectionOrder.includes(label)
          ? sectionOrder.indexOf(label)
          : sectionOrder.length;
      return rank(a) - rank(b) || a.localeCompare(b);
    })
    .map((label) => ({
      label,
      entries: entries.filter((entry) => (entry.section ?? "Guides") === label),
    }));
}

export function matchesDoc(entry: DocEntry, query: string) {
  const haystack = [
    entry.title,
    entry.group,
    entry.section,
    entry.path,
    entry.description,
    ...(entry.methods ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}
export function docHref(slug: string) {
  return `/docs/${slug.split("/").map(encodeURIComponent).join("/")}`;
}

export function markdownHref(slug: string) {
  return `/docs/raw/${slug.split("/").map(encodeURIComponent).join("/")}.md`;
}

export function topicSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function catalogHref(section: string, group?: string) {
  const sectionPath =
    section === "API reference"
      ? "reference/api"
      : section === "Source contracts"
        ? "reference/contracts"
        : "guides";
  return `/docs/${sectionPath}${group ? `/${topicSlug(group)}` : ""}`;
}

export function getCatalogView(slug: string | undefined, entries: DocEntry[]) {
  const sections = ["Guides", "API reference", "Source contracts"];
  for (const section of sections) {
    const base = catalogHref(section).replace("/docs/", "");
    if (slug === base) return { section, title: section, group: "" };
    const group = entries.find(
      (entry) =>
        entry.section === section &&
        `${base}/${topicSlug(entry.group)}` === slug,
    )?.group;
    if (group) return { section, title: group, group };
  }
}
