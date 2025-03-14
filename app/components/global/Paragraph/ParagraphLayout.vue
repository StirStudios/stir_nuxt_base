<script setup lang="ts">
import type { SectionProps } from '~/types/ContentTypes'
import { componentExists } from '~/utils/componentExists'

const appConfig = useAppConfig()

withDefaults(
  defineProps<{
    section?: SectionProps[]
  }>(),
  {
    section: [],
  },
)

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
  const container = appConfig.stirTheme.container
  const defaultGap = appConfig.stirTheme.grid.gap || 'gap-4'

  return (layout: SectionProps) => {
    const gridClass = layout.gridClass || 'grid-cols-1'
    const appliedContainerClass = layout.container ? container : ''

    return [gridClass, defaultGap, appliedContainerClass]
      .filter(Boolean)
      .join(' ')
  }
})

const getNodeProps = (item) => {
  if (item.element === 'paragraph-carousel') {
    return {
      item: item,
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
        animate: item.animate,
        direction: item.direction,
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
        <h2 :class="appConfig.stirTheme.container" v-html="layout.header" />
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
                :is="
                  componentExists(item.element)
                    ? resolveComponent(item.element)
                    : 'ParagraphDefault'
                "
                v-bind="getNodeProps(item)"
              />
            </article>
          </template>
        </div>
      </div>
    </section>
    <section v-else :class="appConfig.stirTheme.container">
      <component
        v-if="getNodeProps(layout) !== null"
        :is="resolveComponent(layout.element)"
        v-bind="getNodeProps(layout)"
      />
    </section>
  </template>
</template>
