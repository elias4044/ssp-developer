# SchoolSoft+ Developer

The developer site for [SchoolSoft+](https://ssp.elias4044.com). Built with Next.js 16, React 19, Tailwind CSS 4, and Geist.

## Run locally

Use Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Other commands:

```sh
npm run lint
npm test
npm run build
npm start
```

On Windows, use `npm run dev -- --webpack` if Turbopack cannot create its required filesystem links.

## Documentation source

All reference content comes from [`elias4044/schoolsoftplus`, branch `main`, directory `docs/`](https://github.com/elias4044/schoolsoftplus/tree/main/docs). This site does not maintain a second copy of the reference.

- Add `.md` or `.mdx` files anywhere beneath `docs/`. Nested folders become nested routes; README indexes supply the navigation structure.
- `docs/README.md` becomes `/docs/README`; `docs/api/auth.md` becomes `/docs/api/auth`.
- The `/docs` home introduces the backend with a reading path, an authenticated-request example, topic guides, and reference shortcuts. Header dropdowns lead to guides, API domains, and contract groups. The reader sidebar shows only the current section or domain.
- API and contract catalogs live at `/docs/reference/api` and `/docs/reference/contracts`, with topic-specific subpaths. API routes can be filtered by HTTP method; longer reference lists load 16 results at a time. Global search opens with the search control or Ctrl/Cmd K.
- Guide labels, descriptions, and order come from links in `docs/README.md`. Route paths, methods, and domain groups come from the route-index table. Contract labels and module groups come from the contract README. New files remain discoverable even before an index links to them.
- The sidebar collapses reference sections and expands the active topic. Search matches titles, descriptions, groups, paths, and HTTP methods. Breadcrumbs, adjacent-document links, and page contents help readers stay oriented.
- GitHub Flavored Markdown supports tables, task lists, fenced code, and automatic links. Frontmatter is omitted from the rendered body. MDX is rendered as Markdown; JavaScript, JSX components, and raw HTML are not executed.
- Relative Markdown links point to local document routes. Relative images and other files resolve against the same repository commit. Heading links have stable IDs with suffixes for duplicates.
- The shared source snapshot revalidates after five minutes; rendered docs pages revalidate after one minute. These are request-driven background refreshes, so the first request after expiry can receive the prior version. No redeployment is needed for additions, edits, or removals.
- "Check for updates" immediately expires the tagged source snapshot, reads the latest main commit, and invalidates every rendered docs page and the homepage. It refreshes the current reader without a full-page loading screen. The revision link identifies the exact source snapshot.
- The same update action also invalidates the AI-readable index, full reference, and Markdown pages, keeping agent context aligned with the reader.
- Published document pages are prerendered and served from Next.js's route cache. Newly added paths render on their first visit and then join the cache. Markdown fetched at an immutable commit stays cached; a new commit automatically uses a new content key.
- Document links prefetch complete pages and use client navigation, including links inside Markdown. The current page remains visible until its replacement is ready, without a full-page loading flash.
- Missing documentation shows an unpublished state. Network errors, rate limits, and incomplete GitHub responses show an unavailable state with recovery links.
- The previous `/docs/ssp-node`, `/docs/schoolsoft-api`, `/docs/ssp-routes`, and `/docs/auth-v2` URLs remain entry points until matching upstream documents exist. Other missing document paths show the not-found page when the index is available. Next.js streamed responses use HTTP 200 with `noindex` metadata for these pages.

The source is public, so no token is required. For higher GitHub API limits, set an optional `GITHUB_TOKEN` in the server environment. It is never sent to the browser. Each upstream request has an eight-second timeout.

## AI-readable documentation

- `/llms.txt`: a categorized Markdown index with links to every source document.
- `/llms-full.txt`: the complete reference from one indexed commit. If any document is unavailable, it returns 503 rather than presenting an incomplete bundle as complete.
- `/docs/raw/<document-slug>.md`: an individual Markdown document, with source revision and provenance. For example, `/docs/raw/backend/authentication.md`.
- Every reader page provides Copy for AI, Copy Markdown, Copy page link, and Open as Markdown actions. HTML metadata advertises the Markdown alternate.

Agent responses include an `X-Docs-Revision` header. Relative links inside document bodies resolve against the original source location, included above each document. `NEXT_PUBLIC_SITE_URL` can override the canonical documentation origin for preview deployments; its default is `https://developer.ssp.elias4044.com`.

## Structure

- `app/page.tsx`: developer landing page.
- `app/docs/[[...slug]]/page.tsx`: documentation index and reader.
- `lib/docs.ts`: GitHub loading, indexing, relative-link handling, and headings.
- `lib/docs-metadata.ts`: README-derived guide order, endpoint methods, and contract labels.
- `components/DocNavigation.tsx`: searchable, collapsible navigation with the active branch expanded.
- `components/DocsUpdates.tsx` and `app/docs/actions.ts`: explicit source refresh and cache invalidation.
- `components/MarkdownContent.tsx`: safe Markdown rendering.
- `components/DocSearch.tsx`: client-side document filtering.
- `components/SourceTools.tsx`: copyable setup and repository metadata.
- `app/globals.css`: SchoolSoft+ inspired tokens, responsive layouts, and reduced-motion behavior.
- `scripts/docs.test.mjs`: documentation source and navigation checks.
