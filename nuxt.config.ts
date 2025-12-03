import { defineNuxtConfig } from 'nuxt/config';
import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  css: [resolve('./app/assets/css/main.css')],

  modules: [
    function (_, nuxt) {
      const modules = nuxt.options.modules.map((m) =>
        typeof m === 'string' ? m : m[0],
      );

      // Auto-enable Nuxt UI
      if (!modules.includes('@nuxt/ui')) {
        console.warn('[admin-layer] enabling @nuxt/ui automatically');
        nuxt.options.modules.unshift('@nuxt/ui');
      }
    },
  ],
});
