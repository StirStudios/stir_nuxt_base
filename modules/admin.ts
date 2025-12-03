import {
  defineNuxtModule,
  createResolver,
  getLayerDirectories,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'nuxtjs-drupal-stir-admin',
    configKey: 'stirAdmin',
  },

  setup(_options, nuxt) {
    // 1. Identify the root of THIS layer (super important)
    const layers = getLayerDirectories();
    const adminLayer = layers.find((l) =>
      l.root.includes('nuxtjs-drupal-stir-admin'),
    );

    const { resolve } = createResolver(adminLayer?.root ?? import.meta.url);

    // 2. Inject Tailwind Vite plugin using THIS layer's node_modules
    nuxt.hook('vite:extend', async ({ config }) => {
      const plugin = await import(
        resolve('./../node_modules/@tailwindcss/vite')
      ).then((r) => r.default);

      config.plugins ||= [];
      config.plugins.push(plugin());
    });

    // 3. Inject PostCSS plugin (again, from THIS layer)
    nuxt.options.postcss ||= {};
    nuxt.options.postcss.plugins ||= {};

    nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {};

    // 4. Auto-enable Nuxt UI if not already installed
    const modules = nuxt.options.modules.map((m) =>
      typeof m === 'string' ? m : m[0],
    );
    if (!modules.includes('@nuxt/ui')) {
      console.warn('[admin-layer] enabling @nuxt/ui automatically');
      nuxt.options.modules.unshift('@nuxt/ui');
    }
  },
});
