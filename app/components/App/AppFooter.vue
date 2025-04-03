<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page } = usePageContext()
const theme = useAppConfig().stirTheme

const currentYear = new Date().getFullYear()

const iconsSocialConfig = [
  {
    title: 'IMDB',
    tooltip: `Follow ${page.site_info?.name} on IMDB`,
    url: '//imdb.com/name/CLIENT/',
    icon: 'i-simple-icons:imdb',
  },
  {
    title: 'LinkedIn',
    tooltip: `Follow ${page.site_info?.name} on LinkedIn`,
    url: '//linkedin.com/in/CLIENT',
    icon: 'i-simple-icons:linkedin',
  },
]
</script>

<template>
  <footer aria-label="Site Footer" :class="theme.footer">
    <div
      :class="[
        theme.container,
        'grid gap-4 text-center md:text-center lg:grid-cols-2',
      ]"
    >
      <div class="rights lg:text-left">
        <ul v-if="page.footer_menu.length" class="mb-3">
          <li v-for="menuItem in page.footer_menu" :key="menuItem.title">
            <ULink class="item" :to="menuItem.url">{{ menuItem.title }}</ULink>
          </li>
        </ul>
        <p class="mb-0 leading-relaxed">
          © {{ page.site_info?.name }} {{ currentYear }}. All Rights
          Reserved.<br />
          Website created & powered by
          <ULink
            active-class="text-primary-400"
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
        <IconsSocial
          v-for="(icon, index) in iconsSocialConfig"
          :key="index"
          v-bind="icon"
        />
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
  </footer>
</template>
