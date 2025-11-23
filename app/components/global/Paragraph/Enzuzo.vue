<script setup lang="ts">
const props = defineProps<{
  // Base CE identity
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  // Component-specific
  embedUrl?: string
}>()

onMounted(() => {
  const scriptId = '__enzuzo-root-script'
  const rootId = '__enzuzo-root'

  if (!props.embedUrl || document.getElementById(scriptId)) return

  const target = document.getElementById(rootId)
  if (!target) return

  const url = props.embedUrl.trim().startsWith('http')
    ? props.embedUrl.trim()
    : `https://${props.embedUrl.trim()}`

  const script = document.createElement('script')
  script.id = scriptId
  script.src = url
  script.defer = true
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'

  target.insertAdjacentElement('afterend', script)
})
</script>

<template>
  <div id="__enzuzo-root" />
</template>
