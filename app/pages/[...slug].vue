<script setup lang="ts">
defineProps({
  layout: String,
})

const appConfig = useAppConfig()
</script>

<template>
  <div>
    <NuxtLayout :name="layout">
      <template #default="{ page, renderCustomElements }">
        <ParagraphHero
          v-if="page.content.hero && page.content.hero.length > 0"
          :hero="page.content.hero[0]"
          :page-title="page.title"
          :site-slogan="page.site_info.slogan"
        />
        <h1 v-else :class="appConfig.stirTheme.h1">{{ page.title }}</h1>
        <LazySiteBreadcrumbs />
        <component :is="renderCustomElements(page.content)" />
      </template>
    </NuxtLayout>
  </div>
</template>
