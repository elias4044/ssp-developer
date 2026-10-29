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

- Add `.md` or `.mdx` files anywhere beneath `docs/`. Nested folders become navigation groups and nested routes.
- `docs/README.md` becomes `/docs/README`; `docs/api/auth.md` becomes `/docs/api/auth`.
- The `/docs` index lists all published documents, searchable by title, group, and path. Titles are derived from file names; the document body retains its own heading.
- GitHub Flavored Markdown supports tables, task lists, fenced code, and automatic links. Frontmatter is omitted from the rendered body. MDX is rendered as Markdown; JavaScript, JSX components, and raw HTML are not executed.
- Relative Markdown links point to local document routes. Relative images and other files resolve against the same repository commit. Heading links have stable IDs with suffixes for duplicates.
- The server checks GitHub on a five-minute cache interval. No site redeployment is needed when documents are added. The first request after expiry triggers revalidation; the refreshed result may appear on the following request.
- Published document pages are prerendered and served from Next.js's route cache. Newly added paths render on their first visit and then join the cache. Markdown fetched at an immutable commit stays cached; a new commit automatically uses a new content key.
- Document links prefetch complete pages and use client navigation, including links inside Markdown. The current page remains visible until its replacement is ready, without a full-page loading flash.
- Missing documentation shows an unpublished state. Network errors, rate limits, and incomplete GitHub responses show an unavailable state with recovery links.
- The previous `/docs/ssp-node`, `/docs/schoolsoft-api`, `/docs/ssp-routes`, and `/docs/auth-v2` URLs remain entry points until matching upstream documents exist. Other missing document paths show the not-found page when the index is available. Next.js streamed responses use HTTP 200 with `noindex` metadata for these pages.

The source is public, so no token is required. For higher GitHub API limits, set an optional `GITHUB_TOKEN` in the server environment. It is never sent to the browser. Each upstream request has an eight-second timeout.

## Structure

- `app/page.tsx`: developer landing page.
- `app/docs/[[...slug]]/page.tsx`: documentation index and reader.
- `lib/docs.ts`: GitHub loading, indexing, relative-link handling, and headings.
- `components/MarkdownContent.tsx`: safe Markdown rendering.
- `components/DocSearch.tsx`: client-side document filtering.
- `components/SourceTools.tsx`: copyable setup and repository metadata.
- `app/globals.css`: SchoolSoft+ inspired tokens, responsive layouts, and reduced-motion behavior.
- `scripts/docs.test.mjs`: documentation source and navigation checks.
