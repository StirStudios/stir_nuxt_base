export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  vite: {
    server: {
      allowedHosts:
        process.env.NODE_ENV === 'development'
          ? [process.env.SERVER_DOMAIN_CLIENT]
          : [],
    },
  },
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
    public: {
      api: process.env.DRUPAL_URL,
    },
  },
})
