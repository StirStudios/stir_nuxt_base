import { defineNuxtConfig } from 'nuxt/config';
import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  css: [resolve('./app/assets/css/main.css')],

  modules: [
    function (_, nuxt) {
      const modules = nuxt.options.modules.map((m) =>
        typeof m === 'string' ? m : m[0],
      );

      if (!modules.includes('@nuxt/ui')) {
        console.warn('[admin-layer] enabling @nuxt/ui automatically');
        nuxt.options.modules.unshift('@nuxt/ui');
      }

      // 🚀 Add Tailwind support for CSS @imports
      nuxt.hook('vite:extend', async ({ config }) => {
        const plugin = await import('@tailwindcss/vite').then((r) => r.default);
        config.plugins ||= [];
        config.plugins.push(plugin());
      });

      // 🚀 Add PostCSS support
      nuxt.options.postcss ||= {};
      nuxt.options.postcss.plugins ||= {};
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {};
    },
  ],
});
