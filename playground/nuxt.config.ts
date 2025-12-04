// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  extends: [
    'github:StirStudios/nuxtjs-drupal-stir#release/nuxtjs-drupal-stir-admin',
  ],

  modules: ['nuxtjs-drupal-ce'],
  drupalCe: {
    drupalBaseUrl: process.env.DRUPAL_URL,
    enableComponentPreview: false,
  },
  runtimeConfig: {
    api: process.env.DRUPAL_URL,
    apiKey: process.env.DRUPAL_API_KEY || '',
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET,
    },
    public: {
      api: process.env.DRUPAL_URL,
    },
  },
});
