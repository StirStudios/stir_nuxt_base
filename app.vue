<template>
  <div class="transition">
    <NuxtLoadingIndicator />
    <a
      class="bg-primary absolute left-0 top-0 z-50 m-3 -translate-y-16 p-3 text-black transition focus:translate-y-0"
      href="#main-content"
      >Skip to main content</a
    >
    <NavigationMain />
    <NuxtPage />
    <UNotifications />
    <LazyAppScrollToTop />
  </div>
</template>

<style scroped>
.page-enter-active,
.page-leave-active {
  @apply transition-all duration-500;
}
.page-enter-from,
.page-leave-to {
  @apply opacity-0;
}
</style>
