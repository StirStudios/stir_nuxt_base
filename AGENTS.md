# AGENTS.md

This repo is a **Nuxt 4 + Nuxt UI 4 + Tailwind 4** starter with **Lupus Decoupled Drupal (Custom Elements)**
integration via **nuxtjs-drupal-ce**.
Use the guidance below when making changes.

## Project overview
- **Framework:** Nuxt 4 (SSR by default)
- **UI:** Nuxt UI 4 + Tailwind CSS 4
- **CMS:** Decoupled Drupal CE (`nuxtjs-drupal-ce`)
- **Build tooling:** Vite + Nitro

## Repository structure (high level)
- `app/` – Nuxt app (pages, components, composables, plugins)
- `server/` – Nitro server routes/middleware
- `assets/` – CSS, images, and other static assets
- `docs/` – project documentation
- `nuxt.config.ts`, `app.config.ts` – primary configuration

## Environment & configuration
- Document any required environment variables in `readme.md` and keep `nuxt.config.ts` aligned.
- If a change adds/renames env vars, update docs and note in summaries.
- Prefer `.env`-driven configuration; avoid hardcoding URLs or secrets.
- Call out any runtime overrides used via `NUXT_PUBLIC_DRUPAL_CE_*` environment variables.

## Coding conventions
- **TypeScript first.** Prefer typed params/returns and keep types close to usage.
- **Nuxt/Vue patterns.** Use composables for shared logic and keep components focused.
- **Tailwind + Nuxt UI tokens.** Prefer existing design tokens/variants before adding custom CSS.
- **Avoid over-commenting.** Add comments only for non-obvious logic, assumptions, or external constraints.
- **No try/catch around imports.** (Project-wide rule.)
- **File naming:** follow Nuxt conventions (PascalCase components, camelCase composables).

## Drupal integration guidance
- This project targets **Lupus Decoupled Drupal (Custom Elements)** and uses **nuxtjs-drupal-ce**.
- Favor existing Drupal CE utilities/composables for fetching content.
- Keep content mapping and schema assumptions explicit in code (types or inline doc comment).
- If a change affects rendering of Drupal-driven layouts, blocks, or custom elements, call it out in the summary.
- If a change requires new Drupal fields, Custom Elements config, or JSON:API includes, document in `docs/` or `readme.md`.
- **Custom element component naming:** prefer kebab-case filenames matching element names
  (e.g. `node-article-teaser.vue`) to keep a 1:1 mapping; defaults can use `--default` suffixes.
- **Component location:** place global custom element components in `components/global` when applicable.
- **Custom Elements JSON format:** default is `explicit`; use `legacy` only for older backends and document the reason.
- **Key module options to document when changed:** `drupalBaseUrl`, `serverDrupalBaseUrl`, `ceApiEndpoint`,
  `customElementJsonFormat`, and any menu endpoint overrides.

## Best practices
- Keep SSR compatibility in mind (no direct browser-only APIs at module top-level).
- Prefer server-safe APIs and `process.client`/`process.server` guards when needed.
- Avoid breaking changes to public interfaces/config unless explicitly requested.
- For new UI, confirm it matches Nuxt UI theming and tokens before adding custom styles.

## Testing & verification
Use the existing scripts when appropriate:
- `pnpm lint` – lint the codebase
- `pnpm build` – production build
- `pnpm dev` – local dev server
- `pnpm generate` – static generation when needed

If tests aren’t run, mention why in the summary.

## Release workflow
- Do **not** run `pnpm release` unless explicitly requested.

## PR expectations
- Summaries should highlight user-facing changes and any Drupal integration impact.
- Note any configuration changes and required environment variables.
