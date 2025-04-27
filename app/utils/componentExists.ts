/**
 * Normalize an element name from Drupal/Lupus style to Vue component style.
 * Example: 'drupal-view-portfolio-page' → 'paragraph-view-portfolio'
 */
export const normalizeElementName = (name: string): string => {
  if (typeof name !== 'string' || !name) return ''

  let formatted = name

  if (formatted.startsWith('drupal-view-')) {
    formatted = formatted.replace('drupal-view-', 'paragraph-view-')
    formatted = formatted.replace(/-page$/, '')
  }

  return formatted
}

/**
 * Check if a component is registered in the Vue application.
 * Automatically normalizes the name.
 *
 * @param name - The raw element name from the API.
 * @returns {boolean} - True if the component exists, false otherwise.
 */
export const componentExists = (name: unknown): boolean => {
  if (typeof name !== 'string' || !name) return false

  const nuxtApp = useNuxtApp()

  const formatted = normalizeElementName(name)

  const formatNameForVue = (name: string) =>
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

  return !!nuxtApp.vueApp.component(formatNameForVue(formatted))
}

/**
 * Resolve a Vue component name from an element string.
 * Normalizes and formats it automatically.
 *
 * @param name - The raw element name.
 * @returns {string} - The component name to resolve.
 */
export const resolveComponentName = (name: unknown): string => {
  if (typeof name !== 'string' || !name) return 'ParagraphDefault'

  const formatted = normalizeElementName(name)

  return formatted
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
