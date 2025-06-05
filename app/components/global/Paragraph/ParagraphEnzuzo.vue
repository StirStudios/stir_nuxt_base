<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'
import { onMounted } from 'vue'

const props = defineProps<{ item: RegionItemProps }>()

onMounted(() => {
  if (document.getElementById('__enzuzo-root-script')) return

  const target = document.getElementById('__enzuzo-root')
  if (!target) return

  const script = document.createElement('script')
  script.id = '__enzuzo-root-script'
  script.src = props.item.embedUrl
  script.defer = true
  script.crossOrigin = 'anonymous'
  script.referrerPolicy = 'no-referrer'
  target.insertAdjacentElement('afterend', script)
})
</script>

<template>
  <div id="__enzuzo-root" />
</template>
