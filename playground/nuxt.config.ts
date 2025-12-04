export default defineNuxtConfig({
  devtools: { enabled: true },

  extends: [
    'github:StirStudios/nuxtjs-drupal-stir#release/nuxtjs-drupal-stir-admin',
  ],

  modules: ['nuxtjs-drupal-ce'],
  drupalCe: {
    drupalBaseUrl: process.env.DRUPAL_URL,
    enableComponentPreview: false,
  },
});
