export default defineNuxtConfig({
  compatibilityDate: '2025-11-30',

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    [
      'nuxtjs-drupal-ce',
      {
        drupalBaseUrl: process.env.DRUPAL_URL,
        exposeAPIRouteRules: true,
      },
    ],
  ],
  runtimeConfig: {
    api: process.env.DRUPAL_URL,
    public: {
      api: process.env.DRUPAL_URL,
    },
  },
})
