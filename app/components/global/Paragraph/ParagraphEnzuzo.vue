<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{ item: RegionItemProps }>()

onMounted(() => {
  const SCRIPT_ID = '__enzuzo-root-script'
  const ROOT_ID = '__enzuzo-root'

  const { embedUrl } = props.item
  if (!embedUrl || document.getElementById(SCRIPT_ID)) return

  const target = document.getElementById(ROOT_ID)
  if (!target) return

  const sanitizedUrl = embedUrl.trim().startsWith('http')
    ? embedUrl.trim()
    : `https://${embedUrl.trim()}`

  if (import.meta.dev) {
    console.log('[Enzuzo] Injecting script:', sanitizedUrl)
  }

  const script = document.createElement('script')
  script.id = SCRIPT_ID
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
