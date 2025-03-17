/**
 * Check if a component is registered in the Vue application.
 * @param name - The component name.
 * @returns {boolean} - Returns true if the component exists, otherwise false.
 */
export const componentExists = (name: unknown): boolean => {
  if (typeof name !== 'string' || !name) return false // Ensure it's a valid string

  const nuxtApp = useNuxtApp()

  const formatName = (name: string) =>
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

  return !!nuxtApp.vueApp.component(formatName(name))
}
