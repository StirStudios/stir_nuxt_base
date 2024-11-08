<script setup lang="ts">
import type { SectionProps } from '~/types/ContentTypes'

const appConfig = useAppConfig()

defineProps<{
  section: SectionProps[]
}>()

// Computed property to check if the layout is valid for rendering
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

const getClassForLayout = computed(() => {
  const { grid, container, gap } =
    appConfig.stirTheme.gridLayouts

  return (layout: SectionProps) => {
    // Retrieve grid class for layout directly from config
    const gridClass =
      gridClasses[layout.layout] || 'sm:grid-cols-1 lg:grid-cols-1'
    const appliedContainerClass = layout.container ? containerClass : ''

    return [
      'grid',
      'grid-cols-1', // Base grid definition
      gap, // Apply responsive gap from config
      gridClass, // Combined responsive grid class from config
      appliedContainerClass,
    ]
      .filter(Boolean)
      .join(' ')
  }
})

const getNodeProps = (item) => {
  if (item.element === 'paragraph-carousel') {
    return {
      item: item,
      amount: item.carouselCount,
      header: item.header,
      indicators: item.carouselIndicators,
      interval: item.carouselInterval,
      items: item.media || item.textRepeat || [],
      width: item.width,
    }
  } else if (item.element === 'paragraph-view') {
    return {
      item: {
        ...item.content,
        carousel: item.carousel,
        carouselIndicators: item.carouselIndicators,
        carouselInterval: item.carouselInterval,
        spacing: item.spacing,
        width: item.width,
        gridCount: item.gridCount,
        animate: item.animate,
        direction: item.direction,
      },
    }
  } else if (item.element === 'paragraph-webform') {
    return {
      webform: item.webform,
    }
  } else if (item.element === 'field-entity-reference-revisions') {
    return null
  } else {
    return {
      item: item,
    }
  }
}
</script>

<template>
  <template v-for="layout in section" :key="layout.id">
    <section
      v-if="isValidParagraphLayout(layout)"
      :class="[layout.classes ? layout.classes : 'content', layout.spacing]"
    >
      <template v-if="layout.header">
        <h2 v-html="layout.header" />
      </template>
      <div
        :id="layout.label ?? null"
        :class="[layout.width, getClassForLayout(layout)]"
      >
        <div
          v-for="regionItem in layout.regions"
          :key="regionItem[0]?.uuid"
          :class="regionItem[0].region"
        >
          <template v-for="item in regionItem" :key="item.uuid">
            <article>
              <component
                :is="resolveComponent(item.element)"
                v-bind="getNodeProps(item)"
              />
            </article>
          </template>
        </div>
      </div>
    </section>
    <section v-else class="container mx-auto">
      <component
        v-if="getNodeProps(layout) !== null"
        :is="resolveComponent(layout.element)"
        v-bind="getNodeProps(layout)"
      />
    </section>
  </template>
</template>
