import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    const csrfToken = await $fetch(`${config.public.api}/session/token`)
    return { csrfToken }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error)
    return { csrfToken: null }
  }
})
