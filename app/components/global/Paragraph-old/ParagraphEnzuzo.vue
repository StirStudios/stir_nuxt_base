<script setup lang="ts">
import type { RegionItemProps } from '~/types'

const props = defineProps<{ item: RegionItemProps }>()

onMounted(() => {
  const scriptId = '__enzuzo-root-script'
  const rootId = '__enzuzo-root'

  const { embedUrl } = props.item
  if (!embedUrl || document.getElementById(scriptId)) return

  const target = document.getElementById(rootId)
  if (!target) return

  const sanitizedUrl = embedUrl.trim().startsWith('http')
    ? embedUrl.trim()
    : `https://${embedUrl.trim()}`

  if (import.meta.dev) {
    console.log('[Enzuzo] Injecting script:', sanitizedUrl)
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.src = sanitizedUrl
  script.defer = true
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'

  target.insertAdjacentElement('afterend', script)
})
</script>

<template>
  <div id="__enzuzo-root" />
</template>
