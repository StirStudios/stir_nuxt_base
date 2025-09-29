import useDarkMode from '~/composables/useDarkMode'
import { usePageContext } from '~/composables/usePageContext'

export function useAppLogo(props: { logoSize?: string; addClasses?: string }) {
  const { isDark } = useDarkMode()
  const { page } = usePageContext()
  const theme = useAppConfig().stirTheme

  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const svgClasses = computed(() => {
    const size = props.logoSize || theme.navigation.logoSize || ''
    const fillClass = mounted.value
      ? isDark.value
        ? 'fill-white'
        : 'fill-black'
      : ''
    return `${size} ${props.addClasses || ''} ${fillClass}`.trim()
  })

  const logoTitle = computed(() => page.value.site_info?.name ?? '')

  return {
    svgClasses,
    logoTitle,
    slotProps: computed(() => ({
      classes: svgClasses.value,
      title: logoTitle.value,
    })),
  }
}
