import useDarkMode from './useDarkMode'
import { usePageContext } from './usePageContext'

export function useAppLogo(props: { addClasses?: string }) {
  const { isDark } = useDarkMode()
  const { page } = usePageContext()

  const fillClass = computed(() => {
    if (import.meta.server) {
      return ''
    }
    return isDark.value ? 'fill-white' : 'fill-black'
  })

  const svgClasses = computed(() =>
    [props.addClasses, fillClass.value].filter(Boolean).join(' '),
  )

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
