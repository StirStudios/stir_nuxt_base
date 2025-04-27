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
      :class="[layout.classes ? layout.classes : 'content', layout.spacing]"
    >
      <template v-if="layout.header">
        <h2 :class="container" v-html="layout.header" />
      </template>

      <div
        :id="sectionId(layout) || undefined"
        :class="[
          layout.width,
          classLayout(layout),
          layout.card ? card.base : '',
        ]"
      >
        <div
          v-for="regionItem in layout.regions"
          :key="regionItem[0]?.uuid"
          :class="[regionItem[0].region, regionItem[0].align]"
        >
          <template v-for="item in regionItem" :key="item.uuid">
            <article :class="item.element">
              <component
                :is="
                  componentExists(item.element)
                    ? resolveComponentName(item.element)
                    : 'ParagraphDefault'
                "
                v-bind="getNodeProps(item)"
              />
            </article>
          </template>
        </div>

        <CardGradient v-if="layout.card" :layout="layout" />
      </div>
    </section>

    <section v-else :class="container">
      <component
        :is="
          componentExists(layout.element)
            ? resolveComponentName(layout.element)
            : 'ParagraphDefault'
        "
        v-if="getNodeProps(layout) !== null"
        v-bind="getNodeProps(layout)"
      />
    </section>
  </template>
</template>
