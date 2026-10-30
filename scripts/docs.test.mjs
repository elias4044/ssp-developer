import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
const requireModule = createRequire(import.meta.url);

function loadTypeScript(filePath, overrides = {}) {
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
    overrides[name] ??
    (name === "next/cache"
      ? { unstable_cache: (load) => load }
      : name.startsWith("@/")
        ? loadTypeScript(resolveSource(path.resolve(name.slice(2))), overrides)
        : name.startsWith(".")
          ? loadTypeScript(
              resolveSource(path.resolve(path.dirname(filePath), name)),
              overrides,
            )
          : requireModule(name));
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
    assert.equal(request.options.cache, "force-cache");
    assert.ok(request.options.signal instanceof AbortSignal);
    const requests = [];
    global.fetch = async (url, options) => {
      requests.push({ url, options });
      return url.includes("/commits/")
        ? Response.json({ sha: "commit", commit: { tree: { sha: "tree" } } })
        : url.includes("/git/trees/")
          ? Response.json({ tree, sha: "tree", truncated: false })
          : new Response("# Overview");
    };
    await docs.getDocsIndex();
    assert.equal(requests.length, 3);
    assert.equal(requests[0].options.cache, "no-store");
    assert.ok(
      requests
        .slice(1)
        .every(({ options }) => options.next.revalidate === false),
    );
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

test("README indexes supply guide order, endpoint methods, topics, and contract names", () => {
  const { enrichDocsEntries } = loadTypeScript(
    path.resolve("lib/docs-metadata.ts"),
  );
  const { getDocSections, matchesDoc } = loadTypeScript(
    path.resolve("lib/docs-shared.ts"),
  );
  const files = [
    "README",
    "backend/architecture",
    "backend/authentication",
    "backend/routes/README",
    "backend/routes/auth-login",
    "backend/contracts/README",
    "backend/contracts/requestBody",
  ];
  const entries = docs.createDocsIndex(
    files.map((file) => ({ path: `docs/${file}.md`, type: "blob" })),
    "sha",
  ).entries;
  const enriched = enrichDocsEntries(entries, {
    "docs/README.md":
      "# Backend docs\n\nStart with the guides.\n\n- [Architecture](backend/architecture.md): Request lifecycle and validation.\n- [Authentication](backend/authentication.md): Sessions and tokens.\n- [Every route](backend/routes/README.md): Full endpoint reference.\n- [Contracts](backend/contracts/README.md): Shared types.",
    "docs/backend/routes/README.md":
      "# Routes\n\n| Route | Explicit methods | Guide |\n| --- | --- | --- |\n| [`/api/auth/login`](auth-login.md) | GET, POST | [authentication](../authentication.md) |",
    "docs/backend/contracts/README.md":
      "# Contracts\n\n- [app/api/lib/requestBody.ts](requestBody.md)",
  });
  const architecture = enriched.find(
    (entry) => entry.slug === "backend/architecture",
  );
  const authentication = enriched.find(
    (entry) => entry.slug === "backend/authentication",
  );
  assert.ok(enriched.indexOf(architecture) < enriched.indexOf(authentication));
  assert.equal(architecture.description, "Request lifecycle and validation.");
  const endpoint = enriched.find(
    (entry) => entry.slug === "backend/routes/auth-login",
  );
  assert.equal(endpoint.title, "/api/auth/login");
  assert.equal(endpoint.group, "Authentication");
  assert.deepEqual(endpoint.methods, ["GET", "POST"]);
  assert.equal(
    enriched.find((entry) => entry.slug === "backend/contracts/requestBody")
      .title,
    "Request Body",
  );
  assert.deepEqual(
    getDocSections(enriched).map((section) => section.label),
    ["Guides", "API reference", "Source contracts"],
  );
  assert.ok(matchesDoc(endpoint, "POST authentication"));
  assert.ok(!matchesDoc(endpoint, "DELETE authentication"));
});

test("a refreshed source snapshot includes added files, drops removed files, and uses the new commit", async () => {
  const originalFetch = global.fetch;
  let revision = "before";
  const seen = [];
  try {
    global.fetch = async (url) => {
      seen.push(url);
      if (url.includes("/commits/"))
        return Response.json({
          sha: revision,
          commit: { tree: { sha: `${revision}-tree` } },
        });
      if (url.includes("/git/trees/"))
        return Response.json({
          sha: `${revision}-tree`,
          truncated: false,
          tree: [
            { path: "docs/README.md", type: "blob" },
            { path: `docs/${revision}.md`, type: "blob" },
          ],
        });
      return new Response(
        url.endsWith("README.md")
          ? `# Docs\n\n- [${revision} guide](${revision}.md): Current guide.`
          : `# ${revision} content`,
      );
    };
    const before = await docs.getDocsIndex();
    assert.ok(before.entries.some((entry) => entry.slug === "before"));
    revision = "after";
    const after = await docs.getDocsIndex();
    assert.equal(after.revision, "after");
    assert.ok(!after.entries.some((entry) => entry.slug === "before"));
    assert.equal(
      after.entries.find((entry) => entry.slug === "after").title,
      "after guide",
    );
    assert.ok(seen.some((url) => url.includes("/after/docs/README.md")));
    assert.ok(after.checkedAt);
  } finally {
    global.fetch = originalFetch;
  }
});

test("checking for updates expires the shared snapshot and invalidates every cached docs route", async () => {
  const calls = [];
  const actions = loadTypeScript(path.resolve("app/docs/actions.ts"), {
    "next/cache": {
      updateTag: (tag) => calls.push(["tag", tag]),
      revalidatePath: (...args) => calls.push(["path", ...args]),
    },
    "@/lib/docs": {
      docsCacheTag: "docs-test",
      getDocsIndex: async () => ({
        status: "ready",
        entries: [],
        revision: "new-revision",
      }),
    },
  });
  const result = await actions.checkDocsUpdates();
  assert.equal(result.revision, "new-revision");
  assert.deepEqual(calls, [
    ["tag", "docs-test"],
    ["path", "/docs", "layout"],
    ["path", "/llms.txt"],
    ["path", "/llms-full.txt"],
    ["path", "/"],
  ]);
});

test("documentation home is a reading path, while reference catalogs are explicit destinations", () => {
  const { DocsOverview } = loadTypeScript(
    path.resolve("components/DocsOverview.tsx"),
  );
  const { getCatalogView, catalogHref } = loadTypeScript(
    path.resolve("lib/docs-shared.ts"),
  );
  const entries = [
    {
      path: "docs/backend/architecture.md",
      slug: "backend/architecture",
      title: "Architecture",
      group: "Guides",
      section: "Guides",
    },
    {
      path: "docs/backend/authentication.md",
      slug: "backend/authentication",
      title: "Authentication",
      group: "Guides",
      section: "Guides",
    },
    {
      path: "docs/backend/worked-examples.md",
      slug: "backend/worked-examples",
      title: "Worked examples",
      group: "Guides",
      section: "Guides",
    },
    {
      path: "docs/backend/routes/login.md",
      slug: "backend/routes/login",
      title: "/api/login",
      group: "Authentication",
      section: "API reference",
    },
  ];
  const html = renderToStaticMarkup(createElement(DocsOverview, { entries }));
  assert.match(html, /Your first integration/);
  assert.match(html, /Know your session/);
  assert.ok(!html.includes('href="/docs/backend/routes/login"'));
  assert.match(html, /href="\/llms.txt"/);
  assert.equal(
    catalogHref("API reference", "Authentication"),
    "/docs/reference/api/authentication",
  );
  assert.deepEqual(getCatalogView("reference/api/authentication", entries), {
    section: "API reference",
    title: "Authentication",
    group: "Authentication",
  });
});

test("AI indexes and page Markdown include canonical links and exact source provenance", () => {
  const { buildAgentIndex, buildAgentDocument } = loadTypeScript(
    path.resolve("lib/agent-docs.ts"),
  );
  const entry = {
    path: "docs/backend/authentication.md",
    slug: "backend/authentication",
    title: "Authentication",
    group: "Guides",
    section: "Guides",
    description: "Sessions and tokens.",
  };
  const index = { status: "ready", entries: [entry], revision: "commit-123" };
  const markdown = buildAgentIndex(index, "https://docs.example.com");
  assert.match(markdown, /Source revision: commit-123/);
  assert.match(
    markdown,
    /https:\/\/docs.example.com\/docs\/raw\/backend\/authentication.md/,
  );
  const document = buildAgentDocument(
    entry,
    "# Authentication\n\nReal content.",
    "commit-123",
    "https://docs.example.com",
  );
  assert.match(document, /blob\/commit-123\/docs\/backend\/authentication.md/);
  assert.match(document, /Real content\./);
});

test("agent routes return Markdown from the indexed revision and reject missing documents", async () => {
  const entry = {
    path: "docs/backend/authentication.md",
    slug: "backend/authentication",
    title: "Authentication",
    group: "Guides",
    section: "Guides",
  };
  const overrides = {
    "@/lib/docs": {
      getDocsIndex: async () => ({
        status: "ready",
        entries: [entry],
        revision: "commit-agent",
      }),
      getDocContent: async (_path, revision) => {
        assert.equal(revision, "commit-agent");
        return "# Authentication\n\nSource content.";
      },
      stripFrontmatter: (content) => content,
    },
  };
  const raw = loadTypeScript(
    path.resolve("app/docs/raw/[...slug]/route.ts"),
    overrides,
  );
  const response = await raw.GET(
    new Request("https://docs.example.com/docs/raw/backend/authentication.md"),
    { params: Promise.resolve({ slug: ["backend", "authentication.md"] }) },
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/markdown/);
  assert.equal(response.headers.get("x-docs-revision"), "commit-agent");
  assert.match(await response.text(), /Source content/);
  const missing = await raw.GET(
    new Request("https://docs.example.com/missing"),
    { params: Promise.resolve({ slug: ["missing.md"] }) },
  );
  assert.equal(missing.status, 404);
  const full = loadTypeScript(
    path.resolve("app/llms-full.txt/route.ts"),
    overrides,
  );
  const bundle = await full.GET();
  assert.equal(bundle.status, 200);
  assert.match(await bundle.text(), /Source content/);
  const failed = loadTypeScript(path.resolve("app/llms-full.txt/route.ts"), {
    "@/lib/docs": {
      ...overrides["@/lib/docs"],
      getDocContent: async () => null,
    },
  });
  assert.equal((await failed.GET()).status, 503);
});

test("navigation defaults to guides instead of dumping routes and contracts into the index", () => {
  const { DocSearch } = loadTypeScript(
    path.resolve("components/DocSearch.tsx"),
  );
  const entries = [
    {
      path: "docs/backend/architecture.md",
      slug: "backend/architecture",
      title: "Architecture",
      group: "Guides",
      section: "Guides",
    },
    {
      path: "docs/backend/routes/login.md",
      slug: "backend/routes/login",
      title: "/api/login",
      group: "Authentication",
      section: "API reference",
    },
    {
      path: "docs/backend/contracts/auth.md",
      slug: "backend/contracts/auth",
      title: "Auth contract",
      group: "Backend helpers",
      section: "Source contracts",
    },
  ];
  const html = renderToStaticMarkup(
    createElement(DocSearch, { entries, status: "ready" }),
  );
  assert.match(html, /Architecture/);
  assert.ok(!html.includes('href="/docs/backend/routes/login"'));
  assert.ok(!html.includes('href="/docs/backend/contracts/auth"'));
  assert.match(html, /API reference/);
});
