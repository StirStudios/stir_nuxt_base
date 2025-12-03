import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const layerDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  css: [resolve(layerDir, './app/assets/css/main.css')],

  modules: [
    function (_, nuxt) {
      const modules = nuxt.options.modules.map((m) =>
        typeof m === 'string' ? m : m[0],
      );

      if (!modules.includes('@nuxt/ui')) {
        nuxt.options.modules.unshift('@nuxt/ui');
      }
    },
  ],

  vite: {
    plugins: [
      // IMPORTANT: this must exist in your admin layer!
      require('@tailwindcss/vite')(),
    ],
  },

  postcss: {
    plugins: {
      // same fallback Nuxt UI uses
      '@tailwindcss/postcss': {},
    },
  },
});
