import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const siteApi = config.public.api

  try {
    const csrfResponse = await fetch(`${siteApi}/session/token`)

    // Handle non-successful responses
    if (!csrfResponse.ok) {
      const errorDetails =
        process.env.NODE_ENV !== 'production'
          ? await csrfResponse.text()
          : 'Error fetching CSRF token'

      console.error('CSRF Fetch Error:', {
        status: csrfResponse.status,
        message: errorDetails,
      })

      throw createError({
        statusCode: csrfResponse.status,
        statusMessage: 'Failed to fetch CSRF token',
      })
    }

    // Extract the token from the response
    const csrfToken = await csrfResponse.text()
    return { csrfToken }
  } catch (error: any) {
    // Handle unexpected errors
    console.error('CSRF Fetch Exception:', error)

    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage:
        error?.statusMessage ||
        'Unexpected server error while fetching CSRF token',
    })
  }
})
