export default defineNuxtConfig({
  compatibilityDate: '2025-00-26',
  css: ['~/assets/css/main.css'],
  features: {
    inlineStyles: true,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'scroll-smooth',
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    server: {
      allowedHosts:
        process.env.NODE_ENV === 'development'
          ? [process.env.SERVER_DOMAIN_CLIENT || 'localhost']
          : [],
    },
    build: {
      minify: true,
    },
  },
  site: {
    name: process.env.NUXT_NAME,
    url: process.env.NUXT_URL,
    indexable: process.env.NUXT_ENV === 'production',
  },
  devtools: { enabled: process.env.NODE_ENV === 'development' },
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
    '/front': { redirect: `${process.env.NUXT_URL}/` },
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/scripts',
    'motion-v/nuxt',
    [
      'nuxt-vitalizer',
      {
        disableStylesheets: 'entry',
        disablePrefetchLinks: true,
        disablePreloadLinks: true,
        delayHydration: {
          hydrateOnEvents: ['mousemove', 'scroll', 'keydown', 'click'],
          idleCallbackTimeout: 8000,
          postIdleTimeout: 4000,
        },
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
    ...(process.env.NUXT_INDEXABLE !== 'false'
      ? [
          [
            '@nuxtjs/sitemap',
            {
              sources: [`${process.env.DRUPAL_URL}/api/sitemap`],
              cacheMaxAgeSeconds: 3600,
              xslColumns: [
                { label: 'URL', width: '50%' },
                {
                  label: 'Last Modified',
                  select: 'sitemap:lastmod',
                  width: '25%',
                },
                {
                  label: 'Priority',
                  select: 'sitemap:priority',
                  width: '12.5%',
                },
                {
                  label: 'Change Frequency',
                  select: 'sitemap:changefreq',
                  width: '12.5%',
                },
              ],
            },
          ],
        ]
      : []),
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
    },
  },
})
