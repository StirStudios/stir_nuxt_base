<script setup lang="ts">
import type { Section } from '~/types'

defineProps<{
  section: Section[]
}>()

// Computed property to check if the layout is valid for rendering
const isValidParagraphLayout = computed(() => {
  return (layout: Section) => {
    return (
      layout.element === 'paragraph-layout' &&
      Object.values(layout.regions).some(
        (regionArray) => Array.isArray(regionArray) && regionArray.length > 0,
      )
    )
  }
})

const getClassForLayout = computed(() => {
  return (layout: Section) => {
    const layoutToColumnsMap = {
      one_column: 1,
      two_column: 2,
      three_column: 3,
      four_column: 4,
    }

    const columnCount =
      layout.layout in layoutToColumnsMap
        ? layoutToColumnsMap[layout.layout]
        : 0

    const smClasses = {
      1: 'sm:grid-cols-1 lg:grid-cols-1',
      2: 'sm:grid-cols-1 lg:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    }
    const lgClasses = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
    }

    const smClass = smClasses[columnCount] || 'sm:grid-cols-1'
    const lgClass = lgClasses[columnCount] || 'lg:grid-cols-1'
    const containerClass = layout.container
      ? 'mx-auto container px-4 md:px-5'
      : ''

    return ['grid', 'grid-cols-1', 'gap-10', smClass, lgClass, containerClass]
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
      },
    }
  } else if (item.element === 'paragraph-webform') {
    return {
      webform: item.webform,
    }
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
    <section v-else-if="!layout.element === 'field-entity-reference-revisions'">
      <UContainer class="mb-10">
        <ParagraphText :item="layout" />
      </UContainer>
    </section>
  </template>
</template>
