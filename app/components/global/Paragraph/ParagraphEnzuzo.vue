<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{ item: RegionItemProps }>()

onMounted(() => {
  const id = '__enzuzo-root-script'
  if (!props.item.embedUrl || document.getElementById(id)) return

  const target = document.getElementById('__enzuzo-root')
  if (!target) return

  const embedUrl = props.item.embedUrl.startsWith('http')
    ? props.item.embedUrl.trim()
    : `https://${props.item.embedUrl.trim()}`

  if (import.meta.dev) {
    console.log('Injecting Enzuzo script:', embedUrl)
  }

  const script = document.createElement('script')
  script.id = id
  script.src = embedUrl
  script.defer = true
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'

  target.insertAdjacentElement('afterend', script)
})
</script>

<template>
  <div id="__enzuzo-root" />
</template>
