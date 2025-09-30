/**
 * Normalize an element name from Drupal/Lupus style to Vue component style.
 * Example: 'drupal-view-portfolio-page' → 'paragraph-view-portfolio'
 */
export const normalizeElementName = (name: string): string => {
  if (typeof name !== 'string' || !name) return ''
  return name
    .toLowerCase()
    .replace(/^drupal-view-/, 'paragraph-view-') // Drupal views
    .replace(/-page$/, '') // Remove trailing -page
}

/**
 * Format a normalized name to match Vue component naming conventions.
 * Example: 'paragraph-view-portfolio' → 'ParagraphViewPortfolio'
 */
const formatNameForVue = (name: string): string =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

/**
 * Check if a component is registered in the Vue application.
 * Automatically normalizes the name.
 */
export const componentExists = (name: unknown): boolean => {
  if (typeof name !== 'string' || !name) return false
  const nuxtApp = useNuxtApp()
  return !!nuxtApp.vueApp.component(
    formatNameForVue(normalizeElementName(name)),
  )
}

/**
 * Resolve a Vue component name from an element string.
 * Normalizes and formats it automatically.
 */
export const resolveComponentName = (name: unknown): string => {
  if (typeof name !== 'string' || !name) return 'ParagraphDefault'
  return formatNameForVue(normalizeElementName(name))
}
