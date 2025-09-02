export function useNavLock() {
  const nuxtApp = useNuxtApp()
  // shared across pages to persist during transitions
  const locked = useState<boolean>('nav-locked', () => false)

  if (import.meta.client) {
    nuxtApp.hook('page:start', () => (locked.value = true))
    nuxtApp.hook('page:finish', () => (locked.value = false))
    nuxtApp.hook('page:error', () => (locked.value = false))
  }
  return { locked }
}
