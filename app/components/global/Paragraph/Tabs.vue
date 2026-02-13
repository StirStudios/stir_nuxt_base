<script setup lang="ts">
defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  editLink?: string
}>()

const vueSlots = useSlots()
const active = ref<string | number>('0')
type TabsItem = { label: string; value: string }
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
      class="mb-6 w-full"
      :items="items"
    >
      <template #content>
        <component :is="activeTabNode" v-if="activeTabNode" />
      </template>
    </UTabs>
  </EditLink>
</template>
