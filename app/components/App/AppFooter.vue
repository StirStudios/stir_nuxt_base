<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page } = usePageContext()
const theme = useAppConfig().stirTheme

const currentYear = new Date().getFullYear()
const iconsSocialConfig = theme.socials || []
</script>

<template>
  <UFooter
    aria-label="Site Footer"
    :ui="{
      root: theme.footer,
      container: `${theme.container} text-center`,
      left: 'text-muted text-sm leading-relaxed lg:text-left',
      right: 'lg:items-end flex flex-col items-center gap-2 lg:text-right',
    }"
  >
    <LazyRegionArea area="footer" />

    <template #left>
      <p class="mb-0">
        © {{ page.site_info?.name }} {{ currentYear }}. All Rights Reserved.<br />
        <template v-if="theme.footerRights">
          {{ theme.footerRights }}<br />
        </template>
        Website created & powered by
        <ULink
          active-class="text-primary-400"
          inactive-class="text-primary hover:text-primary-400"
          rel="noopener"
          target="_blank"
          to="//www.stirstudiosdesign.com"
        >
          StirStudios
        </ULink>
      </p>
    </template>

    <UNavigationMenu
      v-if="page.footer_menu?.length"
      class="mb-3"
      :items="
        page.footer_menu.map((item) => ({
          label: item.title,
          to: item.url,
        }))
      "
      variant="link"
    />

    <template #right>
      <div class="flex gap-1">
        <IconsSocial
          v-for="(icon, index) in iconsSocialConfig"
          :key="index"
          v-bind="icon"
          class="me-1"
        />
      </div>

      <ULink
        rel="noopener"
        target="_blank"
        :to="`mailto:${page.site_info?.mail}`"
      >
        {{ page.site_info?.mail }}
      </ULink>
    </template>
  </UFooter>
</template>
