<script setup lang="ts">
interface ProductPriceProps {
  regularPrice?: string | null;
  salePrice?: string | null;
}

const { regularPrice, salePrice } = defineProps<ProductPriceProps>();
</script>

<template>
  <div class="flex gap-[15px] items-center">
    <span class="text-gray text-[14px] uppercase" v-html="regularPrice"/>
    <span class="text-[20px] uppercase text-pizza-red font-bold" v-html="salePrice"/>
  </div>

</template>
