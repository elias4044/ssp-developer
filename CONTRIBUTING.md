# Contributing to SchoolSoft+ Developer Docs

Thank you for your interest in contributing! This site documents the unofficial SchoolSoft API and the SchoolSoft+ platform routes. Because the SchoolSoft API is entirely reverse-engineered, contributions keeping the docs accurate and up-to-date are especially valuable.

---

## Ways to contribute

- **Fix inaccuracies** — API behaviour or response shapes that have changed
- **Add missing endpoints** — routes or parameters not yet documented
- **Improve descriptions** — clearer explanations, better examples
- **Fix typos / grammar**
- **Improve the site itself** — UI/UX, accessibility, performance
- **Report issues** — open a GitHub Issue if you spot something wrong

---

## Development setup

```bash
git clone https://github.com/elias4044/ssp-developer.git
cd ssp-developer
npm install
npm run dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000). Changes to any file hot-reload automatically.

---

## Making a change

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b fix/schedule-endpoint-params
   ```

2. **Make your changes.** See the project structure in [README.md](README.md) for where to look.

3. **Check for errors:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit** with a short, descriptive message:
   ```
   fix: correct schedule endpoint week param range
   docs: add missing Authorization header to login endpoint
   feat: add /api/assignments/{id} endpoint docs
   ```
   We loosely follow [Conventional Commits](https://www.conventionalcommits.org/).

5. **Open a Pull Request** against `master`. Fill in the PR template — include a brief description of what changed and why.

---

## Editing API docs

All doc pages live in `app/docs/`. They are Next.js Server Components and use the primitives exported from `components/DocComponents.tsx`:

| Component | Use for |
|---|---|
| `<SectionHeading id="...">` | Top-level `h2` section with anchor link |
| `<SubHeading id="...">` | Secondary `h3` heading |
| `<EndpointCard method="GET" path="..." description="...">` | Collapsible endpoint card |
| `<CodeBlock language="json" code={...}>` | Code sample with copy button |
| `<ParamTable rows={[...]} title="...">` | Request / response parameter table |
| `<Callout type="info|warning|danger">` | Highlighted notice |

**ParamTable row shape:**
```ts
{ name: string; type: string; required: boolean; description: string }
```

The sidebar is driven by the `SidebarSection[]` array at the top of each page — add a new entry there whenever you add a new `<SectionHeading>`.

---

## Code style

- TypeScript strict mode — no `any`
- Inline `style={{}}` props for component-level styles (no Tailwind classes inside doc components)
- All colors via CSS custom properties (`var(--accent)`, `var(--muted)`, etc.) — no hardcoded hex values in component files
- No external UI libraries inside doc components

---

## Reporting an issue

Open a [GitHub Issue](https://github.com/elias4044/ssp-developer/issues) and include:

- Which endpoint or section is affected
- What the current docs say
- What the correct behaviour is (with evidence if possible)

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
