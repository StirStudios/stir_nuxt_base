export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.apiKey

    // Apply only to GET requests targeting /api/*
    if (
      event.node.req.method === 'GET' &&
      event.node.req.url?.startsWith('/api/')
    ) {
      event.node.req.headers['X-API-Key'] = apiKey
    }
  })

  // Stop execution immediately for 403 responses
  nitroApp.hooks.hook('response', (event) => {
    if (event.node.res.statusCode === 403) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: `Access denied to: ${event.node.req.url}`,
      })
    }
  })
})
