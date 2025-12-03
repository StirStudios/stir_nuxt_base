import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const layerDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  css: [resolve(layerDir, './app/assets/css/main.css')],

  modules: [
    function (_, nuxt) {
      const modules = nuxt.options.modules.map((m) =>
        typeof m === 'string' ? m : m[0],
      );

      // Auto-enable Nuxt UI if missing
      if (!modules.includes('@nuxt/ui')) {
        console.warn('[admin-layer] enabling @nuxt/ui automatically');
        nuxt.options.modules.unshift('@nuxt/ui');
      }

      // ⭐ FIX: Inject Tailwind Vite plugin so @import "tailwindcss" resolves
      nuxt.hook('vite:extend', async ({ config }) => {
        const plugin = await import('@tailwindcss/vite').then((r) => r.default);
        config.plugins ||= [];
        config.plugins.push(plugin());
      });

      // ⭐ FIX: Also inject PostCSS plugin when not using Vite builder
      if (nuxt.options.builder !== '@nuxt/vite-builder') {
        nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {};
      }
    },
  ],
});
