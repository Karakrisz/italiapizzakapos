<script setup lang="ts">
const { toggleCart } = useCart();
</script>

<template>
  <div class="flex flex-col items-center justify-center flex-1 mb-20 ">
    <Icon name="ion:cart-outline text-gray-400" size="96" class="opacity-75 mb-5" />
    <div class="mb-2 text-xl font-semibold text-gray-600">{{ $t('messages.shop.cartEmpty') }}</div>
    <span class="mb-8">{{ $t('messages.shop.addProductsInYourCart') }}</span>
    <NuxtLink
      to="/products"
      class="button text-white bg-Primary"
      @click="toggleCart(false)">
      {{ $t('messages.shop.browseOurProducts') }}
    </NuxtLink>
  </div>
</template>
