<script setup>
const props = defineProps({
  products: { type: Array, default: null },
});
</script>

<template>
  <div v-if="products" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
    <ProductCard
      v-for="(node, i) in products"
      :key="node.databaseId"
      class="w-full"
      :node="node"
      :index="i"
 />
  </div>
</template>
