<script setup lang="ts">
import type { SectionProps } from '~/types/ContentTypes'
import { componentExists, resolveComponentName } from '~/utils/componentExists'

defineProps<{
  section?: SectionProps[]
}>()

const { container, card } = useAppConfig().stirTheme

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

const getNodeProps = (item) => {
  if (item.element === 'paragraph-carousel') {
    return {
      item,
      amount: item.gridItems,
      header: item.header,
      indicators: item.carouselIndicators,
      arrows: item.carouselArrows,
      fade: item.carouselFade,
      autoscroll: item.carouselAutoscroll,
      interval: item.carouselInterval,
      overlay: item.overlay,
      items: item.media,
      width: item.width,
    }
  } else if (item.element === 'paragraph-view') {
    return {
      item: {
        ...item.content,
        carousel: item.carousel,
        carouselIndicators: item.carouselIndicators,
        carouselArrows: item.carouselArrows,
        carouselFade: item.carouselFade,
        carouselAutoscroll: item.carouselAutoscroll,
        carouselInterval: item.carouselInterval,
        overlay: item.overlay,
        spacing: item.spacing,
        width: item.width,
        gridItems: item.gridItems,
        direction: item.direction,
      },
    }
  } else if (item.element === 'paragraph-calendly') {
    return {
      calendlyUrl: item.calendlyUrl,
      calendlyScheme: item.calendlyScheme,
      title: item.title,
    }
  } else if (item.element === 'paragraph-webform') {
    return {
      webform: item.webform,
    }
  } else {
    return {
      item,
    }
  }
}
</script>

<template>
  <template v-for="layout in section" :key="layout.id">
    <section
      v-if="isValidParagraphLayout(layout)"
      :class="[layout.classes || 'content', layout.spacing]"
    >
      <component
        :is="layout.headerTag || 'h2'"
        v-if="layout.header"
        :class="container"
      >
        {{ layout.header }}
      </component>

      <div
        :id="sectionId(layout)"
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
                `${regionName}`,
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
                    v-bind="getNodeProps(item)"
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
      <component
        :is="getLazyComponentName(layout.element)"
        v-if="getNodeProps(layout) !== null"
        v-bind="getNodeProps(layout)"
      />
    </section>
  </template>
</template>
