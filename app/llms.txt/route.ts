import { getDocsIndex } from "@/lib/docs";
import { buildAgentIndex } from "@/lib/agent-docs";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  const index = await getDocsIndex();
  if (index.status === "unavailable")
    return new Response(
      "Documentation is temporarily unavailable. Please try again.",
      { status: 503 },
    );
  return new Response(buildAgentIndex(index), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Docs-Revision": index.revision ?? "",
    },
  });
}
