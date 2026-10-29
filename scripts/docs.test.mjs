import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
const requireModule = createRequire(import.meta.url);

function loadTypeScript(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const moduleObject = { exports: {} };
  const resolveSource = (name) =>
    fs.existsSync(`${name}.ts`) ? `${name}.ts` : `${name}.tsx`;
  const localRequire = (name) =>
    name.startsWith("@/")
      ? loadTypeScript(resolveSource(path.resolve(name.slice(2))))
      : name.startsWith(".")
        ? loadTypeScript(
            resolveSource(path.resolve(path.dirname(filePath), name)),
          )
        : requireModule(name);
  new Function("require", "module", "exports", code)(
    localRequire,
    moduleObject,
    moduleObject.exports,
  );
  return moduleObject.exports;
}

const docs = loadTypeScript(path.resolve("lib/docs.ts"));
const { MarkdownContent } = loadTypeScript(
  path.resolve("components/MarkdownContent.tsx"),
);
const tree = [
  { path: "docs/README.md", type: "blob" },
  { path: "docs/api/auth.mdx", type: "blob" },
  { path: "docs/api/notes.md", type: "blob" },
  { path: "docs/assets/example.png", type: "blob" },
  { path: "README.md", type: "blob" },
];

test("only repository docs are indexed, including nested Markdown and MDX", () => {
  const index = docs.createDocsIndex(tree, "commit-sha");
  assert.equal(index.status, "ready");
  assert.equal(index.entries.length, 3);
  assert.equal(index.entries[0].slug, "README");
  assert.equal(index.entries[1].group, "Api");
  assert.equal(index.revision, "commit-sha");
  assert.equal(docs.createDocsIndex([], "sha").status, "empty");
});

test("nested document links stay internal while assets resolve at the same revision", () => {
  const { entries } = docs.createDocsIndex(tree, "sha");
  assert.equal(
    docs.resolveDocLink(
      "notes.md#examples",
      "docs/api/auth.mdx",
      entries,
      "sha",
    ),
    "/docs/api/notes#examples",
  );
  assert.equal(
    docs.resolveDocLink("../README.md", "docs/api/auth.mdx", entries, "sha"),
    "/docs/README",
  );
  assert.equal(
    docs.resolveDocLink(
      "../assets/example.png",
      "docs/api/auth.mdx",
      entries,
      "sha",
      true,
    ),
    "https://raw.githubusercontent.com/elias4044/schoolsoftplus/sha/docs/assets/example.png",
  );
  assert.equal(
    docs.resolveDocLink("#auth", "docs/README.md", entries, "sha"),
    "#auth",
  );
  assert.equal(
    docs.resolveDocLink(
      "https://example.com",
      "docs/README.md",
      entries,
      "sha",
    ),
    "https://example.com",
  );
});

test("heading navigation ignores code, handles formatting, and disambiguates duplicate IDs", () => {
  const content =
    "# Guide\n\n## **Auth** and [sessions](./auth.md)\n\n```md\n## Fake heading\n```\n\n## Repeat\n\n## Repeat\n\nSetext title\n------------\n";
  assert.deepEqual(
    docs.getHeadings(content).map((heading) => heading.id),
    ["guide", "auth-and-sessions", "repeat", "repeat-1", "setext-title"],
  );
  assert.equal(
    docs.stripFrontmatter("---\ntitle: Guide\n---\n# Guide"),
    "# Guide",
  );
});

test("GitHub failures and truncated indexes are unavailable, rather than unpublished", async () => {
  const originalFetch = global.fetch;
  const originalError = console.error;
  console.error = () => {};
  try {
    global.fetch = async () => new Response("", { status: 403 });
    assert.equal((await docs.getDocsIndex()).status, "unavailable");
    global.fetch = async (url) =>
      url.includes("/commits/")
        ? Response.json({ sha: "commit", commit: { tree: { sha: "tree" } } })
        : Response.json({ tree, sha: "sha", truncated: true });
    assert.equal((await docs.getDocsIndex()).status, "unavailable");
    global.fetch = async (url) =>
      url.includes("/commits/")
        ? Response.json({ sha: "commit", commit: { tree: { sha: "tree" } } })
        : Response.json({ tree: [], sha: "sha", truncated: false });
    assert.equal((await docs.getDocsIndex()).status, "empty");
    global.fetch = async () => {
      throw new Error("Offline");
    };
    assert.equal(await docs.getDocContent("docs/README.md", "sha"), null);
  } finally {
    global.fetch = originalFetch;
    console.error = originalError;
  }
});

test("the source revision is a commit, not the Git tree SHA", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async (url) =>
      url.includes("/commits/")
        ? Response.json({
            sha: "commit-sha",
            commit: { tree: { sha: "tree-sha" } },
          })
        : Response.json({ tree, sha: "tree-sha", truncated: false });
    const index = await docs.getDocsIndex();
    assert.equal(index.status, "ready");
    assert.equal(index.revision, "commit-sha");
  } finally {
    global.fetch = originalFetch;
  }
});

test("immutable document reads stay cached by commit while index checks expire", async () => {
  const originalFetch = global.fetch;
  let request;
  try {
    global.fetch = async (url, options) => {
      request = { url, options };
      return new Response("# Published guide");
    };
    assert.equal(
      await docs.getDocContent("docs/api/example guide.md", "abc123"),
      "# Published guide",
    );
    assert.match(request.url, /abc123\/docs\/api\/example%20guide\.md$/);
    assert.equal(request.options.next.revalidate, false);
    assert.ok(request.options.signal instanceof AbortSignal);
    const requests = [];
    global.fetch = async (url, options) => {
      requests.push({ url, options });
      return url.includes("/commits/")
        ? Response.json({ sha: "commit", commit: { tree: { sha: "tree" } } })
        : Response.json({ tree, sha: "tree", truncated: false });
    };
    await docs.getDocsIndex();
    assert.equal(requests.length, 2);
    assert.ok(requests.every(({ options }) => options.next.revalidate === 300));
  } finally {
    global.fetch = originalFetch;
  }
});

test("published Markdown renders tables, code, local links, images, and matching anchors", () => {
  const { entries } = docs.createDocsIndex(tree, "commit");
  const content =
    "# Guide\n\n## **Auth** and [sessions](./auth.mdx)\n\n[Notes](./notes.md#examples)\n\n![Example](../assets/example.png)\n\n| Name | Value |\n| --- | --- |\n| Example | 42 |\n\n```js\nconst example = true;\n```\n\n## Repeat\n\n## Repeat\n";
  const html = renderToStaticMarkup(
    createElement(MarkdownContent, {
      content,
      filePath: "docs/api/auth.mdx",
      entries,
      revision: "commit",
    }),
  );
  assert.match(html, /<table>/);
  assert.match(html, /<pre><code class="language-js">/);
  assert.match(html, /Copy code/);
  assert.match(html, /href="\/docs\/api\/notes#examples"/);
  assert.match(
    html,
    /src="https:\/\/raw.githubusercontent.com\/elias4044\/schoolsoftplus\/commit\/docs\/assets\/example.png"/,
  );
  for (const heading of docs.getHeadings(content))
    assert.ok(html.includes(`id="${heading.id}"`));
});

test("repository content cannot execute HTML, scripts, or unsafe links", () => {
  const html = renderToStaticMarkup(
    createElement(MarkdownContent, {
      content:
        "# Safe\n\n<script>alert('unsafe')</script>\n\n[Bad](javascript:alert%281%29)\n\n<img src=x onerror=alert(1)>",
      filePath: "docs/README.md",
      entries: [],
      revision: "commit",
    }),
  );
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes("<img src=x"));
});
