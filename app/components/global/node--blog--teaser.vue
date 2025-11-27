<script setup lang="ts">
import { useTeaserPost } from '~/composables/useTeaserPost'
const slots = useSlots()
const teaser = useNodeTeaser(slots)

const props = defineProps<{
  title?: string
  created?: string
  path?: { alias: string }
}>()

const { post, orientation } = useTeaserPost(teaser, {
  title: props.title,
  url: props.path?.alias,
  created: props.created,
  orientation: 'vertical',
})
</script>

<template>
  <UBlogPost
    :date="post.date"
    :description="post.description"
    :image="post.image"
    :orientation="orientation"
    :title="post.title"
    :to="post.to"
  >
    <template #header>
      <EditLink v-if="post.editLink" :link="post.editLink" />
    </template>
  </UBlogPost>
</template>
