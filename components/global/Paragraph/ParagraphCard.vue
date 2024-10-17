<script setup lang="ts">
import type { RegionItem } from '../types'

defineProps<{
  item: RegionItem
}>()
</script>

<template>
  <WrapAnimate
    :aos="item?.direction"
    :wrapper="item?.animate === true ? 'div' : undefined"
  >
    <div
      class="relative isolate overflow-hidden rounded-xl bg-gray-900 py-16 text-white sm:py-24 lg:py-32"
    >
      <div class="mx-auto max-w-7xl px-6 md:px-12">
        <div
          :class="[
            'flex flex-col lg:space-x-8',
            item.date || item.location || item.media
              ? 'lg:flex-row'
              : 'lg:flex lg:justify-center',
          ]"
        >
          <!-- First Section -->
          <div
            :class="[
              'flex-1',
              item.date || item.location || item.media ? '' : 'lg:w-full',
            ]"
          >
            <div
              :class="{
                'max-w-xl lg:max-w-lg': true,
                'mx-auto text-center': !item.date && !item.location,
              }"
            >
              <div
                v-if="item.date"
                class="by-0 py-0 text-gray-400"
                v-html="item.date"
              />
              <h3 class="text-xl tracking-tight md:text-3xl">
                {{ item.header }}
              </h3>
              <div
                :class="[
                  item.classes ? item.classes : 'content',
                  item.width,
                  item.spacing,
                ]"
                v-html="item.text"
              />
              <EventBrite :event-id="item.link" v-if="item.link" />
              <div
                v-else
                :class="{
                  'max-w-xl lg:max-w-lg': true,
                  'mx-auto text-center': !item.date && !item.location,
                }"
              >
                <ClientOnly>
                  <UButton
                    class="mt-4"
                    icon="i-heroicons-envelope-solid"
                    label="Contact Us"
                    target="_blank"
                    to="mailto:info@thomaskflagg.com"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>

          <!-- Second Section (Date, Location, Media) -->
          <div
            v-if="item.date && item.location"
            class="mt-10 flex-1 lg:mt-0 lg:w-1/2"
          >
            <div class="space-y-8">
              <MediaSimple v-if="item.media" :media="item.media" />
              <dl
                class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2"
              >
                <div class="flex flex-col items-start">
                  <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                    <UIcon
                      aria-hidden="true"
                      aria-label="Date Icon"
                      class="h-6 w-6"
                      name="i-heroicons-calendar"
                    />
                  </div>
                  <dt class="mt-4 font-semibold text-white">Save the Date</dt>
                  <dd class="mt-2 text-gray-400" v-html="item.date" />
                </div>
                <div class="flex flex-col items-start">
                  <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                    <UIcon
                      aria-hidden="true"
                      aria-label="Location Icon"
                      class="h-6 w-6"
                      name="i-heroicons-map-pin"
                    />
                  </div>
                  <dt class="mt-4 font-semibold text-white">Address</dt>
                  <dd class="mt-2 text-gray-400" v-html="item.location" />
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div
        class="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#f35b0f] to-[#6b4ef2] opacity-30"
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
        />
      </div>
    </div>
  </WrapAnimate>
</template>
