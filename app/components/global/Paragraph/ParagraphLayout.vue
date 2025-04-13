<script setup lang="ts">
import type { SectionProps } from '~/types/ContentTypes'
import { slugify } from '~/utils/slugify'
import { componentExists } from '~/utils/componentExists'

defineProps<{ section?: SectionProps[] }>()

const { container, card } = useAppConfig().stirTheme

const isValidParagraphLayout = (layout: SectionProps) =>
  layout.element === 'paragraph-layout' &&
  Object.values(layout.regions).some(
    (regionArray) => Array.isArray(regionArray) && regionArray.length > 0,
  )

const classLayout = (layout: SectionProps) =>
  [layout.gridClass || 'grid-cols-1', layout.container ? container : '']
    .filter(Boolean)
    .join(' ')

const sectionId = (layout: SectionProps) => {
  return layout.label ? slugify(layout.label) : `section-${layout.id}`
}

const getNodeProps = (item: RegionItemProps) => {
  if (item.element === 'paragraph-carousel') {
    return {
      item: {
        ...item,
        items: item.media,
      },
    }
  } else if (item.element === 'paragraph-view') {
    return {
      item: {
        ...item,
        ...item.content,
        rows: item.rows || item.content?.rows || [],
      },
    }
  } else if (item.element === 'paragraph-webform') {
    return { webform: item.webform }
  }

  return { item }
}
</script>

<template>
  <template v-for="layout in section" :key="layout.id">
    <section
      v-if="isValidParagraphLayout(layout)"
      :class="[layout.classes || 'content', layout.spacing]"
    >
      <h2 v-if="layout.header" :class="container" v-html="layout.header" />

      <div
        :id="sectionId(layout)"
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
                    ? resolveComponent(item.element)
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
        :is="resolveComponent(layout.element)"
        v-bind="getNodeProps(layout)"
      />
    </section>
  </template>
</template>
