<script setup lang="ts">
const accountMenu = await useDrupalCe().fetchMenu('account')
</script>

<template>
  <ul class="account-menu">
    <li v-for="menuItem in accountMenu" :key="menuItem.key">
      <a class="item" :href="menuItem.relative">
        {{ menuItem.title }}
      </a>
    </li>
  </ul>
</template>
