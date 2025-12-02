export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',
  css: ['~/assets/css/main.css'],
  modules: [
    function (_, nuxt) {
      const modules = nuxt.options.modules.map((m) =>
        typeof m === 'string' ? m : m[0],
      );

      if (!modules.includes('@nuxt/ui')) {
        console.warn(
          '[nuxtjs-drupal-stir-admin] @nuxt/ui not found — enabling automatically.',
        );
        nuxt.options.modules.unshift('@nuxt/ui');
      }
    },
  ],
});
