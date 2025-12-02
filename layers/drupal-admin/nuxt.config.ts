export default defineNuxtConfig({
  compatibilityDate: '2025-11-23',
  modules: ['@nuxt/ui', 'nuxtjs-drupal-ce'],
  components: [{ path: '~/components', pathPrefix: false, global: true }],
  runtimeConfig: {
    public: {
      api: '',
    },
  },
})
