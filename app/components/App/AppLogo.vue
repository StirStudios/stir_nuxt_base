<script setup lang="ts">
import useDarkMode from '~/composables/useDarkMode'
import { usePageContext } from '~/composables/usePageContext'

const { isDark } = useDarkMode()
const theme = useAppConfig().stirTheme
const { page } = usePageContext()

const props = defineProps<{
  addClasses?: string
}>()

const svgClasses = computed(() =>
  `${theme.navigation.logoSize} ${props.addClasses || ''} ${isDark.value ? 'fill-white' : 'fill-black'}`.trim(),
)
</script>

<template>
  Add SVG Logo Here
  <!-- <svg
    :class="svgClasses"
    fill="currentColor"
    height="100%"
    :title="page.site_info?.name"
    viewBox="0 0 2400 1560"
    width="100%"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
  >
  </svg> -->
</template>
