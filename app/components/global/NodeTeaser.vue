<script setup lang="ts">
const props = defineProps<{
  url?: string
  title?: string
  created?: string
  orientation?: 'horizontal' | 'vertical'
  teaser: {
    props?: { editLink?: string }
    media?: {
      src?: string
      alt?: string
      width?: number
      height?: number
      srcset?: string
      sizes?: string
    }
    text?: string
  }
}>()

// Normalize teaser into something safe
const teaser = computed(() => {
  return (
    props.teaser ?? {
      props: {},
      media: {},
      text: '',
    }
  )
})

const orientation = computed(() => props.orientation ?? 'horizontal')

// Build proper image config for UBlogPost
const image = computed(() => {
  const m = teaser.value.media
  if (!m || !m.src) return null

  return {
    src: m.src,
    alt: m.alt ?? props.title ?? '',
    width: m.width,
    height: m.height,
    srcset: m.srcset,
    sizes: m.sizes ?? '(min-width: 768px) 50vw, 100vw',
    loading: 'lazy',
    fetchpriority: 'low',
    decoding: 'async',
  }
})

const post = computed(() => ({
  title: props.title ?? '',
  description: teaser.value.text ?? '',
  image: image.value,
  date: props.created
    ? new Date(Number(props.created) * 1000).toISOString().slice(0, 10)
    : '',
  to: props.url ?? '',
  editLink: teaser.value.props?.editLink,
}))
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
