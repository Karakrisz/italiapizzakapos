<script setup>
const { cart, isUpdatingCart } = useCart();

// Debug információk számítása
const itemsDebug = computed(() => {
  return cart.value?.contents?.nodes?.map(item => {
    return {
      key: item.key,
      name: item.product?.node?.name,
      hasExtraData: !!item.extraData,
      extraDataType: item.extraData ? typeof item.extraData : 'undefined',
      extraDataIsArray: Array.isArray(item.extraData),
      extraDataLength: item.extraData ? (Array.isArray(item.extraData) ? item.extraData.length : Object.keys(item.extraData).length) : 0,
      extraDataKeys: item.extraData ? (Array.isArray(item.extraData) ? item.extraData.map((_, i) => i) : Object.keys(item.extraData)) : []
    };
  });
});

// Életciklus hook-ok debugoláshoz
onMounted(() => {
  console.log("OrderSummary komponens betöltve");
  console.log("Kosár objektum:", cart.value);
  
  if (cart.value?.contents?.nodes?.length > 0) {
    console.log("Első kosár elem:", cart.value.contents.nodes[0]);
    
    // Az extraData ellenőrzése
    const firstItem = cart.value.contents.nodes[0];
    console.log("extraData létezik?", !!firstItem.extraData);
    if (firstItem.extraData) {
      console.log("extraData típusa:", typeof firstItem.extraData);
      console.log("extraData tömb?", Array.isArray(firstItem.extraData));
      console.log("extraData tartalma:", firstItem.extraData);
    }
  } else {
    console.log("A kosár üres.");
  }
});

// A kosár változásainak figyelése
watch(() => cart.value, (newCart, oldCart) => {
  console.log("Kosár frissült:", newCart);
  
  if (newCart?.contents?.nodes?.length > 0) {
    const extraDataInfo = newCart.contents.nodes.map(item => ({
      key: item.key,
      hasExtraData: !!item.extraData,
      extraDataDetails: item.extraData
    }));
    
    console.log("Kosárelemek extraData információi:", extraDataInfo);
  }
}, { deep: true });
</script>

<template>
  <aside v-if="cart" class="bg-white rounded-lg shadow-lg mb-8 w-full min-h-[280px] p-4 sm:p-8 relative md:max-w-md md:top-32 md:sticky">
    <h2 class="mb-6 text-xl font-semibold leading-none">{{ $t('messages.shop.orderSummary') }}</h2>

    <!-- Debug Panel - Részletes információk a kosárról -->
    <div class="mb-6 p-3 bg-gray-100 text-xs rounded">
      <details>
        <summary class="font-bold text-red-600 cursor-pointer">Debug Panel</summary>
        <div class="mt-2 space-y-2">
          <div>
            <strong>Kosár elemek száma:</strong> {{ cart.contents?.nodes?.length || 0 }}
          </div>
          <div>
            <strong>itemsDebug computed értéke:</strong>
            <pre class="mt-1 bg-gray-200 p-2 overflow-auto max-h-40">{{ JSON.stringify(itemsDebug, null, 2) }}</pre>
          </div>
          <div>
            <strong>Teljes cart objektum:</strong>
            <button 
              @click="console.log('Cart:', cart)" 
              class="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Log to Console
            </button>
          </div>
        </div>
      </details>
    </div>

    <ul class="flex flex-col gap-4 overflow-y-auto">
      <li v-for="item in cart.contents.nodes" :key="item.key" class="border-b pb-4">
        <!-- 1) Kosár elem kártya -->
        <CartCard :item="item" />

        <!-- 2) Debug: Item tulajdonságok vizsgálata -->
        <div class="mt-4 p-2 bg-gray-50 text-xs rounded overflow-auto">
          <details>
            <summary class="font-bold cursor-pointer">Item Debug Info</summary>
            <div class="mt-2">
              <div><strong>Item kulcs:</strong> {{ item.key }}</div>
              <div><strong>Item tulajdonságok:</strong> {{ Object.keys(item).join(', ') }}</div>
              
              <!-- extraData létezésének ellenőrzése -->
              <div v-if="item.extraData !== undefined">
                <div><strong>extraData típusa:</strong> {{ typeof item.extraData }}</div>
                <div><strong>extraData tömb?</strong> {{ Array.isArray(item.extraData) }}</div>
                <div>
                  <strong>extraData tartalma:</strong>
                  <pre class="mt-1 bg-gray-200 p-2 overflow-auto max-h-40">{{ JSON.stringify(item.extraData, null, 2) }}</pre>
                </div>
              </div>
              <div v-else class="text-red-500">
                Az extraData tulajdonság NEM létezik ezen az item objektumon!
              </div>
            </div>
          </details>
        </div>

        <!-- 3) Eredeti mezők komponens -->
        <CartItemCustomFields :item="item" class="mt-4" />
      </li>
    </ul>

    <AddCoupon class="my-8" />

    <div class="grid gap-1 text-sm font-semibold text-stone-500">
      <div class="flex justify-between">
        <span>{{ $t('messages.shop.subtotal') }}</span>
        <span class="text-stone-700 tabular-nums" v-html="cart.subtotal" />
      </div>
      <div class="flex justify-between">
        <span>{{ $t('messages.general.shipping') }}</span>
        <span class="text-stone-700 tabular-nums">
          {{ parseFloat(cart.shippingTotal) > 0 ? '+' : '' }} {{ cart.shippingTotal }}
        </span>
      </div>
      <Transition name="scale-y" mode="out-in">
        <div v-if="cart && cart.appliedCoupons" class="flex justify-between">
          <span>{{ $t('messages.shop.discount') }}</span>
          <span class="text-Primary tabular-nums">- <span v-html="cart.discountTotal" /></span>
        </div>
      </Transition>
      <div class="flex justify-between mt-4">
        <span>{{ $t('messages.shop.total') }}</span>
        <span class="text-lg font-bold text-stone-700 tabular-nums" v-html="cart.total" />
      </div>
    </div>

    <slot/>

    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <LoadingIcon />
    </div>
  </aside>
</template>

<style scoped>
/* A lehetséges helytakarékosság érdekében a debug panelekre vonatkozó stílusok */
.debug-output {
  font-family: monospace;
}
details summary {
  display: list-item;
}
details summary:hover {
  text-decoration: underline;
}
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>