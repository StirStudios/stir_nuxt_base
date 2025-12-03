import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',

  css: [join(currentDir, './app/assets/css/main.css')],

  modules: [
    // Register your own module so the layer runs!
    join(currentDir, './modules/admin.ts'),
  ],
});
