import { defineNuxtConfig } from 'nuxt/config';
import { createResolver, resolveModule } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

// Resolve @nuxt/ui from either the layer's own dependencies or the host app.
const uiModule = resolveModule('@nuxt/ui', {
  paths: [resolve('./'), process.cwd()],
});

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',
  css: [resolve('./app/assets/css/main.css')],
  modules: [uiModule],
  alias: {
    '@nuxt/ui': uiModule,
  },
});
