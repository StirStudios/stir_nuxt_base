import { defineEventHandler, readFormData, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const drupalApiUrl = config.public.api
  const url = event.node.req.url || ''
  const method = event.node.req.method || 'GET'
  const contentType = event.req.headers['content-type'] || ''

  // Only handle form submissions (not JSON)
  const isFormContentType =
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/x-www-form-urlencoded')

  // Skip handling if it's not a form POST
  if (method !== 'POST' || !isFormContentType) return

  // Only proxy specific forms to Drupal (optional)
  if (!url.startsWith('/api/webform/submit')) return

  const formData = await readFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      message: 'Form data expected but not found.',
    })
  }

  const response = await $fetch
    .raw(`${drupalApiUrl}${url}`, {
      method: 'POST',
      body: formData,
      headers: {
        'x-form-processed': 'true',
      },
    })
    .catch((error) => {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error submitting to Drupal.',
      })
    })

  event.context.drupalCeCustomPageResponse = {
    _data: response._data,
    headers: Object.fromEntries(response.headers.entries()),
  }
})
