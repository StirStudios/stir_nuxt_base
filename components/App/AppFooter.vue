<script lang="ts" setup>
import type { SiteInfo } from '~/base/types'

const props = defineProps<{
  site: SiteInfo
}>()

const currentYear = computed(() => new Date().getFullYear())

const iconsSocialConfig = [
  {
    title: 'IMDB',
    tooltip: `Follow ${props.site.site_info?.name} on IMDB`,
    url: '//imdb.com/name/CLIENT/',
    icon: 'i-simple-icons:imdb',
    iconSize: 'size-10',
  },
  {
    title: 'LinkedIn',
    tooltip: `Follow ${props.site.site_info?.name} on LinkedIn`,
    url: '//linkedin.com/in/CLIENT',
    icon: 'i-simple-icons:linkedin',
    iconSize: 'size-10',
  },
]
</script>

<template>
  <footer
    aria-label="Site Footer"
    class="footer bg-black-400 py-10 text-sm"
    role="contentinfo"
  >
    <UContainer>
      <div class="grid gap-4 text-center md:text-center lg:grid-cols-2">
        <div class="rights lg:text-left">
          <p class="mb-3">ADA Compliance</p>
          <p class="mb-0 leading-relaxed">
            © {{ site.site_info?.name }} {{ currentYear }}. All Rights
            Reserved.<br />
            Website created & powered by
            <ULink
              active-class="text-primary-400"
              class="underline"
              inactive-class="text-primary-500 hover:text-primary-400"
              rel="noopener"
              target="_blank"
              to="//www.stirstudiosdesign.com"
            >
              StirStudios
            </ULink>
          </p>
        </div>
        <div class="social lg:text-right">
          <template v-for="(icon, index) in iconsSocialConfig" :key="index">
            <IconsSocial
              :title="icon.title"
              :tooltip="icon.tooltip"
              :url="icon.url"
              :icon="icon.icon"
              :iconSize="icon.iconSize"
            />
          </template>
          <div class="mt-3">
            <UTooltip :text="`Email ${site.site_info?.name}`">
              <ULink
                rel="noopener"
                target="_blank"
                :to="`mailto:${site.site_info?.mail}`"
              >
                {{ site.site_info?.mail }}
              </ULink>
            </UTooltip>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
