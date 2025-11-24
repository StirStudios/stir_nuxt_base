<script setup lang="ts">
type UITimelineItem = {
  date?: string
  title?: string
  icon?: string
  description?: string
  slot?: string
}

type TimelineEntry = {
  date?: string
  header?: string
  icon?: string
  text?: string
}

const props = defineProps<{
  // Identity
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  // Layout & styling
  align?: string
  direction?: string
  classes?: string
  width?: string
  spacing?: string
  color?: string

  // Data
  timeline?: TimelineEntry[]

  // Editing
  editLink?: string
}>()

const timelineItems = computed<UITimelineItem[]>(() => {
  if (!Array.isArray(props.timeline)) return []

  return props.timeline.map((entry) => ({
    date: entry.date ?? 'Present',
    title: entry.header ?? '',
    icon: entry.icon ?? 'i-lucide-rocket',
    description: entry.text ?? '',
    slot: 'rich',
  }))
})

const wrapperClasses = computed(() =>
  [props.classes, props.width, props.spacing].filter(Boolean).join(' '),
)
</script>

<template>
  <EditLink :link="editLink">
    <WrapAnimate :effect="direction">
      <WrapAlign :align="align">
        <div :class="wrapperClasses">
          <UTimeline
            class="max-w-3xl"
            :color="color ?? 'primary'"
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
