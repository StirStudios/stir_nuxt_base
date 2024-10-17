import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteApi = config.public.api

  try {
    const csrfResponse = await fetch(`${siteApi}/session/token`)

    // Check for a non-OK response and throw an error
    if (!csrfResponse.ok) {
      const errorText =
        process.env.NODE_ENV !== 'production' ? await csrfResponse.text() : ''
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to fetch CSRF token:', errorText)
      }
      throw createError({
        statusCode: csrfResponse.status,
        statusMessage: 'Failed to fetch CSRF token',
      })
    }

    // Successfully retrieve CSRF token
    const csrfToken = await csrfResponse.text()

    return { csrfToken }
  } catch (error) {
    // Log only in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching CSRF token:', error)
    }

    // Ensure error status and message are properly thrown
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
    })
  }
})
