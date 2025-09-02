import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const config = useRuntimeConfig()

  if (password !== config.public.protectedPassword) {
    throw createError({ statusCode: 401, message: 'Invalid password' })
  }

  await setUserSession(event, {
    authenticated: true,
    user: { role: 'reader' },
  })

  return { success: true }
})
