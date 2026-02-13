import useDarkMode from '~/composables/useDarkMode'
import { usePageContext } from '~/composables/usePageContext'

export function useAppLogo(props: { addClasses?: string }) {
  const { isDark } = useDarkMode()
  const { page } = usePageContext()
  const mounted = ref(false)
  onMounted(() => (mounted.value = true))

  const fillClass = computed(() =>
    mounted.value ? (isDark.value ? 'fill-white' : 'fill-black') : '',
  )

  const svgClasses = computed(() =>
    [props.addClasses, fillClass.value].filter(Boolean).join(' '),
  )

  const logoTitle = computed(() => page?.value?.site_info?.name || '')

  return {
    svgClasses,
    logoTitle,
    slotProps: computed(() => ({
      classes: svgClasses.value,
      title: logoTitle.value,
    })),
  }
}
