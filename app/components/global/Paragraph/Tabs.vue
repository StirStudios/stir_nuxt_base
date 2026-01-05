<script setup lang="ts">
const props = defineProps<{
  id?: number | string
  uuid?: string
  editLink?: string
}>()

const vueSlots = useSlots()
const active = ref<string | number>('0')

const tabNodes = computed(() => {
  const nodes = vueSlots.tab?.()
  return Array.isArray(nodes) ? nodes : []
})

const items = computed<TabsItem[]>(() =>
  tabNodes.value.map((tab, index) => ({
    label: tab.props?.title ?? `Tab ${index + 1}`,
    value: String(index),
  })),
)

const activeTabNode = computed(() => {
  const index = Number(active.value)
  return tabNodes.value[index]
})
</script>

<template>
  <EditLink :link="editLink">
    <UTabs
      v-if="items.length"
      v-model="active"
      :items="items"
      class="mb-6 w-full"
    >
      <template #content>
        <component v-if="activeTabNode" :is="activeTabNode" />
      </template>
    </UTabs>
  </EditLink>
</template>
