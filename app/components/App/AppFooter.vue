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
      root: theme.footer.base,
      container: `${theme.container} text-center`,
      left: theme.footer.left,
      right: theme.footer.right,
    }"
  >
    <LazyRegionArea area="footer" />

    <template #left>
      <p class="mb-0">
        © {{ page.site_info?.name }} {{ currentYear }}. All Rights Reserved.<br />
        <template v-if="theme.footer.rights">
          {{ theme.footer.rights }}<br />
        </template>
        Website created & powered by
        <ULink
          inactive-class="transition-colors text-primary hover:text-primary-300"
          raw
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
        v-if="!theme.footer.hideEmail"
        inactive-class="transition-colors text-primary hover:text-primary-300"
        raw
        target="_blank"
        :to="`mailto:${page.site_info?.mail}`"
      >
        {{ page.site_info?.mail }}
      </ULink>
    </template>
  </UFooter>
</template>
