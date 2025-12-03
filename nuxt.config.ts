import { defineNuxtConfig } from 'nuxt/config';
import { createResolver, resolveModule } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  css: [resolve('./app/assets/css/main.css')],

  modules: ['@nuxt/ui'],
});
