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
  compatibilityDate: '2025-03-04',
  nitro: {
    compressPublicAssets: true,
  },
  css: ['~/assets/css/main.css'],
  features: {
    inlineStyles: false,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'scroll-smooth',
      },
    },
  },
  site: {
    name: process.env.NUXT_NAME,
    url: process.env.NUXT_URL,
    indexable: process.env.NUXT_SITE_ENV === 'production' ? true : false,
  },
  routeRules: {
    // General pages cached for 1 day using SWR
    // '/**': { swr: 86400 },
    '/admincontrol/login': {
      redirect: `${process.env.DRUPAL_URL}/admincontrol/login`,
    },
  },
  devtools: { enabled: true },
  routeRules: {
    '/admincontrol': {
      redirect: `${process.env.DRUPAL_URL}/admincontrol/login`,
    },
    '/admincontrol/login': {
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
        cacheMaxAgeSeconds: 3600, // 1 hour
        xslColumns: [
          { label: 'URL', width: '50%' },
          { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
          { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
          {
            label: 'Change Frequency',
            select: 'sitemap:changefreq',
            width: '12.5%',
          },
        ],
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
