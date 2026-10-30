import { getDocContent, getDocsIndex, stripFrontmatter } from "@/lib/docs";
import { buildAgentDocument } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const index = await getDocsIndex();
  return index.entries.map((entry) => ({
    slug: `${entry.slug}.md`.split("/"),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const index = await getDocsIndex();
  if (index.status === "unavailable" || !index.revision)
    return new Response("Documentation is temporarily unavailable.", {
      status: 503,
    });
  const selected = index.entries.find(
    (entry) => entry.slug === slug.join("/").replace(/\.mdx?$/i, ""),
  );
  if (!selected) return new Response("Document not found.", { status: 404 });
  const content = await getDocContent(selected.path, index.revision);
  if (content === null)
    return new Response("This document is temporarily unavailable.", {
      status: 503,
    });
  return new Response(
    buildAgentDocument(selected, stripFrontmatter(content), index.revision),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Docs-Revision": index.revision,
        Link: '</llms.txt>; rel="describedby"',
      },
    },
  );
}
