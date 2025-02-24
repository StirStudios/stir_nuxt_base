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
  nitro: {
    compressPublicAssets: true,
  },
  // css: ['~/assets/css/main.css'],
  features: {
    inlineStyles: false,
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'scroll-smooth',
      },
    },
  },
  site: {
    url: process.env.NUXT_URL,
    indexable: process.env.NUXT_SITE_ENV === 'production' ? true : false,
  },
  devtools: { enabled: true },
  routeRules: {
    '/admincontrol/login': {
      redirect: `${process.env.DRUPAL_URL}/admincontrol/login`,
    },
    '/admincontrol': {
      redirect: `${process.env.DRUPAL_URL}/admincontrol/login`,
    },
    '/admincontrol/password': {
      redirect: `${process.env.DRUPAL_URL}/admincontrol/password`,
    },
  },
  modules: [
    [
      '@nuxtjs/turnstile',
      {
        siteKey: `${process.env.TURNSTILE_KEY}`,
      },
    ],
    [
      '@nuxtjs/robots',
      {
        // disallow: ['/secret', '/admin'],
      },
    ],
    [
      '@nuxtjs/sitemap',
      {
        sources: [`${process.env.DRUPAL_URL}/api/sitemap`],
      },
    ],
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
      turnstileDisable: process.env.NUXT_ENVIRONMENT === 'local',
    },
  },
})
