import { defineEventHandler, readFormData, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const drupalApiUrl = config.public.api

  // Selectively bypass for specific routes
  if (event.node.req.url?.startsWith('/api/webform/submit')) {
    event.context.drupalCeCustomPageResponse = { bypass: true }
    return
  }

  // Apply the default Drupal form handler logic for other forms
  if (event.node.req.method === 'POST') {
    if (event.req.headers['x-form-processed']) {
      return
    }

    const formData = await readFormData(event)

    if (formData) {
      const targetUrl = event.node.req.url
      const response = await $fetch
        .raw(`${drupalApiUrl}${targetUrl}`, {
          method: 'POST',
          body: formData,
          headers: {
            'x-form-processed': 'true',
          },
        })
        .catch((error) => {
          event.context.drupalCeCustomPageResponse = {
            error: {
              data: error,
              statusCode: error.statusCode || 400,
              message:
                error.message ||
                'Error when POSTing form data (customFormHandler).',
            },
          }
        })

      if (response) {
        event.context.drupalCeCustomPageResponse = {
          _data: response._data,
          headers: Object.fromEntries(response.headers.entries()),
        }
      }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'POST requests without form data are not supported (customFormHandler).',
      })
    }
  }
})
