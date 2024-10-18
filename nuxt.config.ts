export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
  },
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
  // routeRules: {
  //   // General pages cached for 1 day using SWR
  //   // '/**': { swr: 86400 },
  //   '/admincontrol/login': {
  //     redirect: `${process.env.DRUPAL_URL}/admincontrol/login`,
  //   },
  // },
  app: {
    head: {
      htmlAttrs: {
        class: 'scroll-smooth',
      },
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  site: {
    url: process.env.NUXT_URL,
    indexable: process.env.NUXT_SITE_ENV === 'production' ? true : false,
  },
  devtools: { enabled: true },
  modules: [
    [
      '@nuxtjs/robots',
      {
        // disallow: ['/secret', '/admin'],
      },
    ],
    // [
    //   '@nuxtjs/turnstile',
    //   {
    //     siteKey: `${process.env.TURNSTILE}`,
    //   },
    // ],
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
    //     [
    //       'nuxt-gtag',
    //       {
    //         id: process.env.GTM,
    //         initialConsent: true,
    //         loadingStrategy: 'defer',
    //       },
    //     ],
    //     [
    //       'nuxt-booster',
    //       {
    //         disableNuxtFontaine: true,
    //         disableNuxtImage: true,
    //
    //         detection: {
    //           performance: true,
    //           browserSupport: true,
    //         },
    //
    //         performanceMetrics: {
    //           device: {
    //             hardwareConcurrency: { min: 2, max: 48 },
    //             deviceMemory: { min: 2 },
    //           },
    //           timing: {
    //             fcp: 800,
    //             dcl: 1200,
    //           },
    //         },

    // fonts: [
    //   {
    //     family: 'Vollkorn',
    //     locals: ['Vollkorn'],
    //     fallback: ['Georgia', 'Times New Roman', 'serif'],
    //     variances: [
    //       {
    //         style: 'normal',
    //         weight: 400,
    //         sources: [
    //           {
    //             src: '@/assets/fonts/vollkorn-v23-latin-regular.woff2',
    //             type: 'woff2',
    //           },
    //           {
    //             src: '@/assets/fonts/vollkorn-v23-latin-regular.woff',
    //             type: 'woff',
    //           },
    //         ],
    //       },
    //       {
    //         style: 'normal',
    //         weight: 500,
    //         sources: [
    //           {
    //             src: '@/assets/fonts/vollkorn-v23-latin-500.woff2',
    //             type: 'woff2',
    //           },
    //           {
    //             src: '@/assets/fonts/vollkorn-v23-latin-500.woff',
    //             type: 'woff',
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],

    //         componentAutoImport: false,
    //         componentPrefix: undefined,
    //
    //         lazyOffset: {
    //           component: '0%',
    //           asset: '0%',
    //         },
    //       },
    //     ],
  ],
  runtimeConfig: {
    // turnstile: {
    //   secretKey: process.env.TURNSTILE_SECRET,
    // },
    api: process.env.DRUPAL_URL,
    public: {
      api: process.env.DRUPAL_URL,
    },
  },
})
