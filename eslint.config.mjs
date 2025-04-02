import withNuxt from './.nuxt/eslint.config.mjs'
import globals from 'globals'

export default withNuxt({
  files: ['**/*.{js,ts,vue}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      $nuxt: 'readonly',
    },
  },
  rules: {
    'vue/no-v-html': 'off',
    'vue/this-in-template': 'off',
    'vue/html-self-closing': 'off',
    'vue/no-unused-vars':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    quotes: ['error', 'single'],
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/order-in-components': 'error',
    'vue/attributes-order': ['error', { alphabetical: true }],
    'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
})
