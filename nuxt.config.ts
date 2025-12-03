import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const layerDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  css: [resolve(layerDir, '~/assets/css/main.css')],

  modules: [
    function (_, nuxt) {
      const modules = nuxt.options.modules.map((m) =>
        typeof m === 'string' ? m : m[0],
      );

      if (!modules.includes('@nuxt/ui')) {
        console.warn('[admin-layer] enabling @nuxt/ui automatically');
        nuxt.options.modules.unshift('@nuxt/ui');
      }
    },
  ],
});
