# Stir Nuxt Base

A production-ready Nuxt 4 starter template with Nuxt UI 4, Tailwind CSS 4, and full decoupled Drupal 11 (Lupus CE) integration for content-driven, SSR-optimized web apps.

## 🚀 Features

- ✅ **Nuxt 4** with full SSR and Vite support
- 🎨 **Nuxt UI 4** with customized design tokens, material-style form variants, and Tailwind 4
- 🧩 **Drupal CE** integration for decoupled content, slot-based layouts, and dynamic form rendering
- 📊 Turnstile CAPTCHA, Sitemap, and Robots support
- 🌀 Smooth scrolling, page transitions, and motion support via `motion-v`
- ⚙️ Vitalizer: Delayed hydration for performance optimization
- 🔐 Environment-aware route rules, protected admin redirects
- 🧪 ESLint, Prettier, and Release It pre-configured
- 📁 Cloudflare-optimized asset compression via Nitro

## 🧱 Tech Stack

- **[Nuxt 4](https://nuxt.com/)**: `^4.2.1`
- **[Nuxt UI 4](https://ui.nuxt.com/)**: `^4.2.1`
- **[Tailwind CSS 4](https://tailwindcss.com/)**: `^4.1.17`
- **[nuxtjs-drupal-ce](https://github.com/drunomics/nuxtjs-drupal-ce)**: `^2.5.0-rc.6`
- **[Vite](https://vitejs.dev/)** + **[Nitro](https://nitro.unjs.io/)**: asset compression and custom build rules

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
