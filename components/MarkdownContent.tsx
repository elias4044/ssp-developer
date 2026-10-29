import Markdown from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import type { Root, Heading } from "mdast";
import {
  headingId,
  markdownText,
  resolveDocLink,
  type DocEntry,
} from "@/lib/docs";
import { CodeBlock } from "@/components/CodeBlock";

function headingAnchors() {
  return (tree: Root) => {
    const counts = new Map<string, number>();
    for (const node of tree.children) {
      if (node.type !== "heading") continue;
      const heading = node as Heading;
      const base = headingId(heading.children.map(markdownText).join(""));
      const count = counts.get(base) ?? 0;
      counts.set(base, count + 1);
      heading.data = {
        ...heading.data,
        hProperties: { id: count ? `${base}-${count}` : base },
      };
    }
  };
}

export function MarkdownContent({
  content,
  filePath,
  entries,
  revision,
}: {
  content: string;
  filePath: string;
  entries: DocEntry[];
  revision: string;
}) {
  return (
    <div className="markdown">
      <Markdown
        remarkPlugins={[remarkGfm, headingAnchors]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          a: ({ href = "", children }) => {
            const resolvedHref = resolveDocLink(
              href,
              filePath,
              entries,
              revision,
            );
            return resolvedHref.startsWith("/docs/") ? (
              <Link href={resolvedHref} prefetch={true}>
                {children}
              </Link>
            ) : (
              <a href={resolvedHref}>{children}</a>
            );
          },
          // Repository images can be arbitrary sizes and hosts; keep Markdown's native image behavior.
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                typeof src === "string"
                  ? resolveDocLink(src, filePath, entries, revision, true)
                  : undefined
              }
              alt={alt ?? ""}
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
