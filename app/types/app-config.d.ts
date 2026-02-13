/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'nuxt/schema' {
  interface AppConfigInput {
    stirTheme?: Record<string, any>
    protectedRoutes?: Record<string, any>
    analytics?: Record<string, any>
    userway?: Record<string, any>
    cookieConsent?: Record<string, any>
    colorMode?: Record<string, any>
  }

  interface AppConfig {
    stirTheme: Record<string, any>
    protectedRoutes: Record<string, any>
    analytics: Record<string, any>
    userway: Record<string, any>
    cookieConsent: Record<string, any>
    colorMode: Record<string, any>
  }
}

export {}
