import { defineNuxtConfig } from 'nuxt/config';
import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  // Only your CSS entry. Nothing else.
  css: [resolve('./app/assets/css/main.css')],

  // Register your admin module (self layer)
  modules: ['nuxtjs-drupal-stir-admin'],
});
