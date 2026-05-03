<div align="center">

 <img src="public/logo.png" alt="SchoolSoft+ Logo" width="72" height="72" />

  <h1>SchoolSoft+ Developer</h1>

  <p>
    The official documentation site for SchoolSoft+ — covering the unofficial SchoolSoft API
    (reverse-engineered) and every route exposed by the SchoolSoft+ platform itself.
  </p>

  <p>
    <a href="https://developer.ssp.elias4044.com"><img src="https://img.shields.io/badge/live-developer.ssp.elias4044.com-7ca5d0?style=flat-square" alt="Live site" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-3fb950?style=flat-square" alt="MIT License" /></a>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-0ea5e9?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
  </p>

  <br/>

</div>

---

## What's in here

| Section | Description |
|---|---|
| [SchoolSoft API Reference](https://developer.ssp.elias4044.com/docs/schoolsoft-api) | Unofficial, reverse-engineered docs for SchoolSoft's internal REST & JSP endpoints — auth flow, schedule, lunch, news, subjects, assignments |
| [SchoolSoft+ Routes](https://developer.ssp.elias4044.com/docs/ssp-routes) | Full reference for every API route in SchoolSoft+ — auth, academic data, social, notes, countdowns, presence, and more |

---

## Stack

- **[Next.js 16](https://nextjs.org/)** — App Router, React 19, Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** — strict mode throughout
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility classes + CSS custom properties for the design system
- **[Lucide React](https://lucide.dev/)** — SVG icon library
- **[Geist](https://vercel.com/font)** — Vercel's Geist Sans & Geist Mono typefaces

No external UI component library — all doc primitives (`CodeBlock`, `EndpointCard`, `ParamTable`, `Callout`, etc.) are hand-rolled in `components/DocComponents.tsx`.

---

## Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repo
git clone https://github.com/elias4044/ssp-developer.git
cd ssp-developer

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # production build
npm run start   # start production server
npm run lint    # run ESLint
```

---

## Project structure

```
app/
├── page.tsx                      # Home / landing page
├── layout.tsx                    # Root layout (NavBar + Footer)
├── globals.css                   # Design tokens (CSS custom properties)
└── docs/
    ├── schoolsoft-api/page.tsx   # Unofficial SchoolSoft API reference
    └── ssp-routes/page.tsx       # SchoolSoft+ routes reference

components/
├── NavBar.tsx                    # Sticky top nav + mobile drawer
├── Footer.tsx                    # Site footer
├── DocLayout.tsx                 # Two-column doc layout (sticky sidebar + main)
├── DocComponents.tsx             # Reusable doc primitives
│   ├── MethodBadge               # GET / POST / PUT / PATCH / DELETE pill
│   ├── CodeBlock                 # Syntax-highlighted code block with copy
│   ├── EndpointCard              # Collapsible endpoint card with copy-path
│   ├── ParamTable                # Request/response parameter table
│   ├── SectionHeading            # h2 with anchor-copy button
│   ├── SubHeading                # h3 with # prefix
│   └── Callout                   # info / warning / danger callout
└── HomeFeatureCards.tsx          # Interactive feature cards (Client Component)
```

---

## Design system

All colors are defined as CSS custom properties in `app/globals.css` and referenced throughout via `var(--*)`. There are no hardcoded color values in component files.

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0d1117` | Page background |
| `--surface` | `#161b22` | Cards, sidebar, navbar |
| `--surface-raised` | `#1c2128` | Elevated surfaces |
| `--border` | `#30363d` | All borders |
| `--foreground` | `#cdd9e5` | Primary text |
| `--muted` | `#768390` | Secondary text |
| `--accent` | `#7ca5d0` | Links, active states, icons |

---

## Contributing

Contributions, corrections, and additions are welcome — especially to the API docs, which are reverse-engineered and may be incomplete or out of date.

1. Fork the repo and create a branch: `git checkout -b fix/my-change`
2. Make your changes
3. Open a pull request — fill in the PR template

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

---

## Related

- **[SchoolSoft+](https://github.com/elias4044/schoolsoftplus)** — the main app this documents
---

## License

[MIT](LICENSE) © Elias Gulam

