import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the current directory of this file
const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  plugins: [join(currentDir, './plugins/aos.client')],
  devtools: { enabled: true },
})
