export function usePageContext() {
  const nuxtApp = useNuxtApp()
  const route = useRoute()

  const currentKey = useState<string>('drupal-ce-current-page-key', () => '')
  const page = computed(() => nuxtApp.payload?.data?.[currentKey.value])

  const isAdministrator = computed(
    () => page.value?.current_user?.roles?.includes('administrator') || false,
  )

  return {
    page,
    isAdministrator,
  }
}
