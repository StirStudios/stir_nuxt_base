<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current: number
    totalPages: number
    maxLinks: number
  }>(),
  {
    current: 0,
    totalPages: 0,
    maxLinks: 8,
  },
)

const previousURL = props.current > 0 ? `?page=${props.current - 1}` : null
const nextURL =
  props.current + 1 < props.totalPages ? `?page=${props.current + 1}` : null
const hellipLeft = props.current > props.maxLinks / 2 + 1
const hellipRight = props.totalPages - props.current > props.maxLinks / 2
</script>

<template>
  <div class="views-pager">
    <nav class="isolate inline-flex gap-1 -space-x-px" aria-label="Pagination">
      <a
        v-if="previousURL"
        :href="previousURL"
        class="relative inline-flex min-w-10 items-center px-2 py-2 text-sm"
      >
        <span class="sr-only">Previous</span>
        &lt;&lt;
      </a>
      <span
        v-if="hellipLeft"
        class="relative inline-flex min-w-10 items-center px-4 py-2"
        >&hellip;</span
      >
      <template v-for="n in totalPages">
        <component
          :is="n - 1 == current ? 'span' : 'a'"
          v-if="
            n - 1 == current ||
            (n - 1 < current && n - 1 > current - maxLinks / 2 - 1) ||
            (n - 1 > current && n - 1 < current + maxLinks / 2 + 1)
          "
          :key="n"
          :href="'?page=' + (n - 1)"
          :class="{
            'relative z-10 inline-flex min-w-10 items-center px-4 py-2':
              n - 1 == current,
            'relative inline-flex min-w-10 items-center px-4 py-2':
              n - 1 != current,
          }"
        >
          {{ n }}
        </component>
      </template>
      <span
        v-if="hellipRight"
        class="relative inline-flex min-w-10 items-center"
        >&hellip;</span
      >
      <a
        v-if="nextURL"
        :href="nextURL"
        class="relative inline-flex min-w-10 items-center px-2 py-2"
      >
        <span class="sr-only">Next</span>
        &gt;&gt;
      </a>
    </nav>
  </div>
</template>
