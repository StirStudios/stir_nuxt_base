export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  vite: {
    server: {
      allowedHosts:
        process.env.NODE_ENV === 'development'
          ? [process.env.SERVER_DOMAIN_CLIENT || 'localhost']
          : [],
    },
    build: {
      modulePreload: false,
    },
  },
  compatibilityDate: '2025-04-09',
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
    indexable: process.env.NUXT_ENV === 'production' ? true : false,
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
    '/front': {
      redirect: `${process.env.NUXT_URL}/`,
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/scripts',
    'motion-v/nuxt',
    [
      'nuxt-vitalizer',
      {
        disableStylesheets: 'entry',
        disablePrefetchLinks: true,
        disablePreloadLinks: true,
      },
    ],
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
    [
      'nuxtjs-drupal-ce',
      {
        drupalBaseUrl: process.env.DRUPAL_URL,
        exposeAPIRouteRules: true,
        disableFormHandler: true,
      },
    ],
  ],
  runtimeConfig: {
    api: process.env.DRUPAL_URL,
    apiKey: process.env.DRUPAL_API_KEY || '',
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET,
    },
    public: {
      api: process.env.DRUPAL_URL,
      turnstileDisable: process.env.NUXT_ENV === 'local',
    },
  },
})
