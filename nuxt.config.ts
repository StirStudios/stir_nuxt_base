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
  css: ['~/assets/css/main.css'],
  features: {
    inlineStyles: false,
  },
  // Absolute must for us to run under DDEV.
  // https://stackoverflow.com/questions/72016669/how-to-config-vite-hmr-port-in-nuxt3-config
  hooks: {
    'vite:extendConfig': (config) => {
      if (typeof config.server!.hmr === 'object') {
        config.server!.hmr.protocol = 'wss'
      }
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'scroll-smooth',
      },
    },
    // pageTransition: { name: 'page', mode: 'out-in' },
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
