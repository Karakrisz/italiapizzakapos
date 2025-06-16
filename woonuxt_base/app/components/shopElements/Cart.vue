<script setup lang="ts">
const { cart, toggleCart, isUpdatingCart } = useCart();

// Debug információk - A slug.vue-ban beállított értékek megtekintése
const logBeforeMount = () => {
  console.log("Cart component initializing");
};

// Komponens betöltésekor logolás
onMounted(() => {
  console.log("Cart component mounted");
  console.log("Cart contents:", cart.value?.contents);
  
  // Megvizsgáljuk, hogy a beépített értékek (extraData) megvannak-e
  if (cart.value?.contents?.nodes?.length > 0) {
    cart.value.contents.nodes.forEach((item, index) => {
      console.log(`Item #${index + 1}:`, item);
      console.log(`Item #${index + 1} has extraData?`, !!item.extraData);
    });
  }
});

// A kosár változásainak figyelése
watch(() => cart.value, (newCart) => {
  console.log("Cart updated:", newCart);
}, { deep: true });

// Azonnal meghívjuk az inicializáló függvényt
logBeforeMount();
</script>

<template>
  <div class="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-11/12 max-w-lg overflow-x-hidden bg-white shadow-lg">
    <EmptyCart v-if="cart && !cart.isEmpty" class="absolute top-6 md:left-8 left-6 rounded-lg shadow-lg p-1.5 w-fit hover:bg-red-400 hover:text-white" />

    <Icon name="ion:close-outline" class="absolute p-1 rounded-lg shadow-lg top-6 right-6 md:right-8 cursor-pointer hover:text-Primary transition" size="34" @click="toggleCart(false)" />

    <div class="mt-8 text-center">
      {{ $t('messages.shop.cart') }}
      <span v-if="cart?.contents?.productCount"> ({{ cart?.contents?.productCount }}) </span>
    </div>

    <!-- Debug információ panel -->
    <div class="bg-gray-100 p-4 mt-4 mb-2 mx-4 rounded-lg text-xs overflow-auto">
      <details>
        <summary class="font-bold text-red-600 cursor-pointer">Debug Info</summary>
        <div v-if="cart?.contents?.nodes?.length > 0" class="mt-2">
          <div v-for="(item, index) in cart.contents.nodes" :key="item.key" class="mb-4 border-b pb-2">
            <div class="font-semibold">Item #{{ index + 1 }}: {{ item.product?.node?.name }}</div>
            <div>Key: {{ item.key }}</div>
            <div>Quantity: {{ item.quantity }}</div>
            <div class="text-red-600">Has extraData: {{ !!item.extraData }}</div>
            
            <!-- Összes property kilistázása -->
            <div class="mt-2">
              <div class="font-semibold">Properties:</div>
              <div class="grid grid-cols-2 gap-1 mt-1">
                <div v-for="(_, prop) in item" :key="prop" class="text-gray-600">{{ prop }}</div>
              </div>
            </div>
            
            <!-- Ha van extraData, megjelenítjük -->
            <div v-if="item.extraData" class="mt-2">
              <div class="font-semibold">extraData:</div>
              <pre class="bg-gray-200 p-2 mt-1 rounded overflow-auto max-h-40">{{ JSON.stringify(item.extraData, null, 2) }}</pre>
            </div>
            
            <!-- Raw item adatok megjelenítése -->
            <details class="mt-2">
              <summary class="cursor-pointer text-blue-600">Teljes item objektum</summary>
              <pre class="bg-gray-200 p-2 mt-1 rounded overflow-auto max-h-60">{{ JSON.stringify(item, null, 2) }}</pre>
            </details>
          </div>
        </div>
        <div v-else class="text-red-500 mt-2">
          Nincsenek elemek a kosárban.
        </div>
      </details>
    </div>

    <ClientOnly>
      <template v-if="cart && !cart.isEmpty">
        <ul class="flex flex-col flex-1 gap-4 p-6 overflow-y-scroll md:p-8">
          <!-- Javított prop-átadás -->
          <CartCard v-for="item in cart.contents?.nodes" :key="item.key" :item="item" />
        </ul>
        <div class="px-8 mb-8">
          <NuxtLink
            class="block p-3 text-lg text-center text-white bg-stone-800 rounded-lg shadow-md justify-evenly hover:bg-stone-900"
            to="/checkout"
            @click.prevent="toggleCart()">
            <span class="mx-2">{{ $t('messages.shop.checkout') }}</span>
            <span v-html="cart.total" />
          </NuxtLink>
        </div>
      </template>
      <!-- Empty Cart Message -->
      <EmptyCartMessage v-else-if="cart && cart.isEmpty" />
      <!-- Cart Loading -->
      <div v-else class="flex flex-col items-center justify-center flex-1 mb-20">
        <LoadingIcon />
      </div>
    </ClientOnly>
    <!-- Cart Loading Overlay -->
    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-25">
      <LoadingIcon />
    </div>
  </div>
</template>