import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    // Read the request body
    const body = await readBody(event)

    if (!body?.webform_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      })
    }

    // Validate Turnstile CAPTCHA if required
    if (!config.public.turnstileDisable && !body.turnstile_response) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CAPTCHA validation failed',
      })
    }

    // Fetch CSRF Token from our API
    const { csrfToken } = await $fetch<{ csrfToken: string }>('/api/auth/csrf')

    // Ensure csrfToken is explicitly cast as a string
    const csrfTokenString: string = csrfToken ?? ''

    // Send JSON to Drupal
    const drupalApiUrl = `${config.public.api}/api/stir_webform_rest/submit`

    return await $fetch(drupalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-Token': csrfTokenString,
      },
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Form submission failed. Please try again later.',
      data: error,
    })
  }
})
