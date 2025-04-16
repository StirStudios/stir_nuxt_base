export default function useDarkMode() {
  const colorMode = useColorMode()

  const isDark = computed({
    get() {
      return colorMode.preference === 'dark'
    },
    set() {
      colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
    },
  })

  return { isDark, colorMode }
}
