export const repositoryUrl = "https://github.com/elias4044/schoolsoftplus";
export const docsSourceUrl = `${repositoryUrl}/tree/main/docs`;
export type DocEntry = {
  path: string;
  slug: string;
  title: string;
  group: string;
};
export type DocsIndex = {
  status: "ready" | "empty" | "unavailable";
  entries: DocEntry[];
  revision?: string;
};
export function docHref(slug: string) {
  return `/docs/${slug.split("/").map(encodeURIComponent).join("/")}`;
}
