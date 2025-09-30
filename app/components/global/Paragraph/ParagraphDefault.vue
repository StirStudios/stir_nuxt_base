<script setup lang="ts">
import { componentExists, resolveComponentName } from '~/utils/componentExists'
defineProps<{ item: ViewItemProps }>()
</script>

<template>
  <template v-if="item.section?.length">
    <template v-for="node in item.section" :key="node.uuid">
      <component
        :is="resolveComponentName(node.element)"
        v-if="componentExists(node.element)"
        :item="node"
      />
      <UAlert
        v-else
        color="error"
        :description="`The component '${node.element}' does not exist. Using default fallback.`"
        icon="i-lucide-terminal"
        title="Missing component"
        variant="subtle"
      />
    </template>
  </template>

  <!-- Render top-level item (e.g. node-blog-teaser) directly -->
  <template v-else>
    <pre class="rounded bg-gray-100 p-4 text-sm text-gray-500">
      {{ item }}
    </pre>
  </template>
</template>
