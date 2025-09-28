<script setup lang="ts">
import useDarkMode from '~/composables/useDarkMode'
import { usePageContext } from '~/composables/usePageContext'

const { isDark } = useDarkMode()
const theme = useAppConfig().stirTheme
const { page } = usePageContext()

const props = defineProps<{
  addClasses?: string
  logoSize?: string
}>()

const svgClasses = computed(() => {
  const size = props.logoSize || theme.navigation.logoSize || ''
  return `${size} ${props.addClasses || ''} ${isDark.value ? 'fill-white' : 'fill-black'}`.trim()
})

const logoTitle = computed(() => page.site_info?.name ?? '')
</script>

<template>
  <slot :class="svgClasses" :title="logoTitle">
    Add SVG Logo Here
    <!-- <svg
      :class="svgClasses"
      fill="currentColor"
      height="100%"
      :title="logoTitle"
      viewBox="0 0 2400 1560"
      width="100%"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="1560" width="2400" />
    </svg> -->
  </slot>
</template>
