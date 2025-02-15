<script lang="ts" setup>
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const siteInfo = computed<SiteInfoProps>(
  () => page.value?.site_info ?? { name: '', slogan: '', mail: '' },
)
const currentYear = computed(() => new Date().getFullYear())

const iconsSocialConfig = [
  {
    title: 'IMDB',
    tooltip: `Follow ${page.site_info?.name} on IMDB`,
    url: '//imdb.com/name/CLIENT/',
    icon: 'i-simple-icons:imdb',
    iconSize: 'size-10',
  },
  {
    title: 'LinkedIn',
    tooltip: `Follow ${page.site_info?.name} on LinkedIn`,
    url: '//linkedin.com/in/CLIENT',
    icon: 'i-simple-icons:linkedin',
    iconSize: 'size-10',
  },
]
</script>

<template>
  <footer
    aria-label="Site Footer"
    class="mt-20 bg-gray-100 py-10 text-sm dark:bg-black"
  >
    <UContainer>
      <div class="grid gap-4 text-center md:text-center lg:grid-cols-2">
        <div class="rights lg:text-left">
          <ul v-if="page.footer_menu" class="mb-3">
            <li v-for="menuItem in page.footer_menu" :key="menuItem.title">
              <a class="item" :href="menuItem.url">
                {{ menuItem.title }}
              </a>
            </li>
          </ul>
          <p class="mb-0 leading-relaxed">
            © {{ page.site_info?.name }} {{ currentYear }}. All Rights
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
            <UTooltip :text="`Email ${page.site_info?.name}`">
              <ULink
                rel="noopener"
                target="_blank"
                :to="`mailto:${page.site_info?.mail}`"
              >
                {{ page.site_info?.mail }}
              </ULink>
            </UTooltip>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
