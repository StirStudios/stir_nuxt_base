<script setup lang="ts">
const accountMenu = await useDrupalCe().fetchMenu('account')
</script>

<template>
  <nav aria-label="Account menu">
    <ul class="mb-3 flex justify-center space-x-4">
      <li v-for="menuItem in accountMenu" :key="menuItem.key">
        <a class="hover:text-primary-500" :href="menuItem.relative">
          {{ menuItem.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>
