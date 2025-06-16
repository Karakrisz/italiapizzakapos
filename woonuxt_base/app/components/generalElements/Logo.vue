<script setup lang="ts">
const { siteName } = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const img = useImage();

const logoUrl = '/img/svg/SVG_Logo.svg';
const faviconUrl = '/img/svg/SVG_Logo.svg';
</script>

<template>
  <NuxtLink to="/">
    <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="object-contain h-10" />
    <div v-else class="flex items-center gap-2 text-lg font-bold">
      <NuxtImg :src="faviconUrl" alt="Logo" width="100" height="32" />
    </div>
  </NuxtLink>
</template>
