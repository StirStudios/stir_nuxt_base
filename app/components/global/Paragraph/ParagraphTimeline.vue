<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

// Wrap single timeline step into array if needed
const timelineItems = computed<TimelineItem[]>(() => {
  if (!Array.isArray(props.item.timeline)) return []

  return props.item.timeline.map((entry) => ({
    date: entry.date ?? 'Present',
    title: entry.header ?? '',
    icon: entry.icon ?? 'i-lucide-rocket',
    description: entry.text ?? '',
    slot: 'rich',
  }))
})
</script>

<template>
  <EditLink :link="item.editLink">
    <WrapAnimate :effect="item?.direction">
      <WrapAlign :align="item.align">
        <div
          :class="[
            [item.classes].filter(Boolean).join(' '),
            item.width,
            item.spacing,
          ]"
        >
          <UTimeline
            class="max-w-3xl"
            :color="item.color ?? 'primary'"
            :default-value="timelineItems.length - 1"
            :items="timelineItems"
          >
            <template #rich-description="{ item: slotItem }">
              <div v-html="slotItem.description" />
            </template>
          </UTimeline>
        </div>
      </WrapAlign>
    </WrapAnimate>
  </EditLink>
</template>
