<script setup lang="ts">
import type { SectionProps } from '~/types'
import { useShuffledLayouts } from '~/composables/useShuffledLayouts'
import { componentExists, resolveComponentName } from '~/utils/componentExists'

const props = defineProps<{
  section?: SectionProps[]
}>()

const shuffledLayouts = useShuffledLayouts(props.section || [])

const { container, card } = useAppConfig().stirTheme

const isValidParagraphLayout = computed(() => {
  return (layout: SectionProps) => {
    return (
      layout.element === 'paragraph-layout' &&
      Object.values(layout.regions).some(
        (regionArray) => Array.isArray(regionArray) && regionArray.length > 0,
      )
    )
  }
})

const classLayout = computed(() => {
  return (layout: SectionProps) => {
    const gridClass = layout.gridClass || 'grid-cols-1'
    const containerClass = layout.container ? container : ''
    return [gridClass, containerClass].filter(Boolean).join(' ')
  }
})

const sectionId = (layout: SectionProps) => {
  return layout.label
    ? layout.label
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    : `section-${layout.id}`
}

const getLazyComponentName = (element: string) => {
  return `Lazy${componentExists(element) ? resolveComponentName(element) : 'ParagraphDefault'}`
}
</script>

<template>
  <template v-for="layout in shuffledLayouts" :key="layout.id">
    <section
      v-if="isValidParagraphLayout(layout)"
      :id="sectionId(layout)"
      :class="[
        layout.classes || 'content',
        layout.spacing,
        layout.randomize ? 'randomize' : '',
      ]"
    >
      <component
        :is="layout.headerTag || 'h2'"
        v-if="layout.header"
        :class="container"
      >
        {{ layout.header }}
      </component>

      <div
        :class="[
          layout.width,
          classLayout(layout),
          layout.card ? card.base : '',
        ]"
      >
        <template
          v-for="[regionName, regionItems] in Object.entries(layout.regions)"
          :key="regionName"
        >
          <template v-if="Array.isArray(regionItems) && regionItems.length > 0">
            <div
              :class="[
                'region',
                regionName,
                regionName === 'top' || regionName === 'bottom'
                  ? 'col-span-full'
                  : '',
                regionItems[0].align || '',
              ]"
            >
              <template v-for="item in regionItems" :key="item.uuid">
                <article :class="item.element">
                  <component
                    :is="getLazyComponentName(item.element)"
                    :item="item"
                  />
                </article>
              </template>
            </div>
          </template>
        </template>

        <CardGradient v-if="layout.card" :layout="layout" />
      </div>
    </section>

    <section v-else :class="container">
      <component :is="getLazyComponentName(layout.element)" :item="layout" />
    </section>
  </template>
</template>
