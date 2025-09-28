<script setup lang="ts">
import useDarkMode from '~/composables/useDarkMode'
import { usePageContext } from '~/composables/usePageContext'

const { isDark } = useDarkMode()
const { page } = usePageContext()
const theme = useAppConfig().stirTheme

const props = defineProps<{
  addClasses?: string
  logoSize?: string
}>()

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

const slotProps = computed(() => ({
  classes: svgClasses.value,
  title: logoTitle.value,
}))
</script>

<template>
  <slot v-bind="slotProps"> Add SVG log here </slot>
</template>
