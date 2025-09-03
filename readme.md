# Stir Nuxt Base

A production-ready Nuxt 3 starter with full integration for Nuxt UI 3, Tailwind CSS 4, and decoupled Drupal 11 CMS via Lupus CE.

## 🚀 Features

- ✅ **Nuxt 3** with full SSR and Vite support
- 🎨 **Nuxt UI 3** with customized design tokens, material-style form variants, and Tailwind 4
- 🧩 **Drupal CE integration** for decoupled content + form rendering
- 📊 Turnstile CAPTCHA, Sitemap, and Robots support
- 🌀 Smooth scrolling, page transitions, and motion support via `motion-v`
- ⚙️ Vitalizer: Delayed hydration for performance optimization
- 🔐 Environment-aware route rules, protected admin redirects
- 🧪 ESLint, Prettier, and Release It pre-configured
- 📁 Cloudflare-optimized asset compression via Nitro

## 🧱 Tech Stack

- **Nuxt**: `^3.18.1`
- **Nuxt UI**: `^3.3.2`
- **Tailwind CSS**: `^4.1.12`
- **Drupal CE**: `^2.4.1`
- **Vite + Nitro**: asset compression and custom build rules

## 📦 Project Structure

- `nuxt.config.ts` — Full config for modules, routing, environment, and build
- `app.config.ts` — UI theming, layout, animation, and third-party settings
- `assets/css/main.css` — Tailwind CSS entry point
- `utils/uiVariants.ts` — Custom Nuxt UI material variant tokens

## 🛠️ Scripts

```bash
pnpm dev        # Start local dev server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Lint project
pnpm release    # Tag + prepare release
```
