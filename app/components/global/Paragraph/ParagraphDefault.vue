<script setup lang="ts">
import { resolveComponentName, componentExists } from '~/utils/componentExists'
defineProps<{ item: any }>()
</script>

<template>
  <!-- First priority: item.section (most common layout structure) -->
  <template v-if="item.section?.length">
    <template v-for="node in item.section" :key="node.uuid || node.title">
      <component
        :is="resolveComponentName(node.element)"
        v-if="componentExists(node.element)"
        :item="node"
      />
      <UAlert
        v-else
        color="error"
        icon="i-lucide-terminal"
        title="Missing component"
        variant="subtle"
      >
        <template #description>
          <div class="space-y-1 text-sm leading-relaxed">
            <p>
              Missing component:
              <code>{{ resolveComponentName(node.element) }}</code>
            </p>
            <p class="text-gray-500">
              You can override this using any of the following:
            </p>
            <ul class="list-disc pl-4 text-gray-500">
              <li>
                <code>{{ resolveComponentName(node.element) }}.vue</code>
              </li>
              <li v-if="item?.element">
                <code>{{ resolveComponentName(item.element) }}.vue</code>
              </li>
            </ul>
          </div>
        </template>
      </UAlert>
    </template>
  </template>

  <!-- Fallback: item.content.rows[x].section (used by drupal-view-* blocks) -->
  <template v-else-if="item.content?.rows?.length">
    <template v-for="row in item.content.rows" :key="row.uuid || row.title">
      <template v-for="node in row.section" :key="node.uuid || node.title">
        <component
          :is="resolveComponentName(node.element)"
          v-if="componentExists(node.element)"
          :item="node"
        />
        <UAlert
          v-else
          color="error"
          icon="i-lucide-terminal"
          title="Missing component"
          variant="subtle"
        >
          <template #description>
            <div class="space-y-1 text-sm leading-relaxed">
              <p>
                Missing component:
                <code>{{ resolveComponentName(node.element) }}</code>
              </p>
              <p class="text-gray-500">
                You can override this using any of the following:
              </p>
              <ul class="list-disc pl-4 text-gray-500">
                <li>
                  <code>{{ resolveComponentName(node.element) }}.vue</code>
                </li>
                <li v-if="row?.element">
                  <code>{{ resolveComponentName(row.element) }}.vue</code>
                </li>
                <li v-if="item?.element">
                  <code>{{ resolveComponentName(item.element) }}.vue</code>
                </li>
              </ul>
            </div>
          </template>
        </UAlert>
      </template>
    </template>
  </template>

  <!-- Catch-all: render entire object for debugging -->
  <template v-else>
    <pre class="rounded bg-gray-100 p-4 text-sm text-gray-500">
      {{ item }}
    </pre>
  </template>
</template>
