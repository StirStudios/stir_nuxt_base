export default defineNuxtConfig({
  compatibilityDate: '2025-02-09',

  css: ['~/assets/css/main.css'],

  features: {
    inlineStyles: false,
  },

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
    apiKey: process.env.DRUPAL_API_KEY || '',
    public: {
      api: process.env.DRUPAL_URL,
    },
  },
})
