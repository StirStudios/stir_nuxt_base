<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

const appConfig = useAppConfig()

// Compute the gradient class dynamically based on the API-provided key
const gradientClass = computed(() => {
  const gradientKey = props.item.gradient || '1'
  return appConfig.stirTheme.gradients[gradientKey] || ''
})
</script>

<template>
  <WrapNone :wrapper="item.editLink ? 'div' : undefined">
    <EditLink :link="item.editLink" />
    <WrapAnimate
      :aos="item?.direction"
      :wrapper="item?.animate === true ? 'div' : undefined"
    >
      <div
        class="relative isolate overflow-hidden rounded-xl bg-black py-16 text-white sm:py-24 lg:py-32"
      >
        <div class="mx-auto max-w-7xl px-6 md:px-12">
          <div
            :class="[
              'flex flex-col items-center space-y-8 lg:space-y-0',
              item.media ? 'lg:flex-row lg:space-x-8' : '',
            ]"
          >
            <div v-if="item.media" class="flex-1">
              <MediaPopup v-if="item.overlay" :media="item.media" />
              <MediaSimple v-else :media="item.media" />
            </div>

            <div class="flex-1">
              <div class="mx-auto max-w-xl lg:max-w-lg lg:text-center">
                <h3 class="text-xl font-bold tracking-tight md:text-3xl">
                  {{ item.header }}
                </h3>
                <div
                  :class="['mt-4', item.classes || 'content prose']"
                  v-html="item.text"
                ></div>
                <div class="mt-6">
                  <ClientOnly v-if="item.link?.[0]?.uri">
                    <UButton
                      :label="item.link[0].title || 'Learn More'"
                      :to="item.link[0].uri"
                      class="mt-4"
                      target="_blank"
                    />
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        >
          <div
            class="aspect-[1155/678] w-[72.1875rem] opacity-30"
            :class="[gradientClass]"
            style="
              clip-path: polygon(
                70% 30%,
                90% 45%,
                100% 40%,
                85% 60%,
                75% 70%,
                55% 65%,
                50% 80%,
                35% 90%,
                20% 75%,
                10% 55%,
                5% 35%,
                20% 10%,
                40% 15%,
                55% 25%,
                70% 30%
              );
            "
          ></div>
        </div>
      </div>
    </WrapAnimate>
  </WrapNone>
</template>
