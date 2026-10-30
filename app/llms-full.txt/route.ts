import { getDocContent, getDocsIndex, stripFrontmatter } from "@/lib/docs";
import { buildAgentDocument } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  const index = await getDocsIndex();
  if (index.status === "unavailable" || !index.revision)
    return new Response(
      "Documentation is temporarily unavailable. Please try again.",
      { status: 503 },
    );
  const documents: string[] = [];
  for (let offset = 0; offset < index.entries.length; offset += 8) {
    const batch = await Promise.all(
      index.entries.slice(offset, offset + 8).map(async (entry) => {
        const content = await getDocContent(entry.path, index.revision!);
        return content === null
          ? null
          : buildAgentDocument(
              entry,
              stripFrontmatter(content),
              index.revision!,
            );
      }),
    );
    if (batch.some((content) => content === null))
      return new Response(
        "The full documentation could not be assembled. Please use /llms.txt for individual documents or try again.",
        { status: 503 },
      );
    documents.push(...(batch as string[]));
  }
  const introduction = `# SchoolSoft+ complete documentation\n\nSource revision: ${index.revision}\n\nEach document below includes its original source URL. Resolve relative links against that document's source location. Examples may be illustrative.\n\n`;
  return new Response(introduction + documents.join("\n\n---\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Docs-Revision": index.revision,
    },
  });
}
