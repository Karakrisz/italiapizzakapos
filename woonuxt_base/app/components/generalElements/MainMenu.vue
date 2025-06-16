<script setup lang="ts">
const links = [
    { text: "Főoldal", to: "/", prefetch: false},
    { text: "Rólunk", to: "/rolunk", prefetch: false},
    { text: "Galéria", to: "/galeria", prefetch: false },
    { text: "Étlap", to: "/products", prefetch: false },
    { text: "Kapcsolat", to: "/kapcsolat", prefetch: false },
];
</script>

<template>
  <nav class="flex flex-wrap items-center justify-center gap-[50px] p-4">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      :class="[
        'relative cursor-pointer text-lg transition hover:text-pizza-red',
        link.class
      ]"
      active-class="text-pizza-red"
      :prefetch="link.prefetch"
    >
      {{ link.text }}
    </NuxtLink>
  </nav>
</template>