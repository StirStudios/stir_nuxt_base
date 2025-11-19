<script setup lang="ts">
import { useSlotsToolkit } from '~/composables/useSlotsToolkit'

const props = defineProps<{
  title?: string
  created?: string | number

  path?: {
    alias?: string
    pid?: string | number
    langcode?: string
  }
}>()
const slots = useSlots()
const tk = useSlotsToolkit(slots)

const heroMedia = computed(() => tk.heroMedia())

const createdDate = formatUnixDate(props.created)
</script>

<template>
  <div class="group relative">
    <ULink class="block" :to="path?.alias">
      <ParagraphHero mode="simple">
        <template #media>
          <div class="relative">
            <component :is="heroMedia" v-if="heroMedia" class="aspect-video" />
            <span
              v-if="createdDate"
              class="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur"
            >
              {{ createdDate }}
            </span>
          </div>
        </template>

        <template #footer>
          <h2 class="display-h3 mt-3">
            {{ title }}
          </h2>
        </template>
      </ParagraphHero>
    </ULink>
  </div>
</template>
