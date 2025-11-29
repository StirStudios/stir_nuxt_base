<script setup lang="ts">
import { useTeaserPost } from '~/composables/useTeaserPost'

const props = defineProps<{
  title?: string
  url?: string
  nid?: string
  created?: string
  orientation?: 'horizontal' | 'vertical'
  teaser: unknown
}>()

const { post, orientation } = useTeaserPost(props.teaser, {
  title: props.title,
  nid: props.nid,
  url: props.url,
  created: props.created,
  orientation: props.orientation,
})
</script>

<template>
  <EditLink :link="post.editLink">
    <UBlogPost
      :date="post.date"
      :description="post.description"
      :image="post.image"
      :orientation="orientation"
      :title="post.title"
      :to="post.to"
    >
      <template #description>
        <div v-html="truncate(post.description, 200)" />
      </template>
    </UBlogPost>
  </EditLink>
</template>
