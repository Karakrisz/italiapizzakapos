<script setup>
const { cart } = useCart();
const props = defineProps({
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  class: String // Explicit módon definiáljuk a class prop-ot
});

const isLoading = ref(false);
const { t } = useI18n();
const addToCartButtonText = computed(() => (
  isLoading.value ? t('messages.shop.adding') : t('messages.shop.addToCart')
));

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false;
});

const handleClick = () => {
  isLoading.value = true;
};
</script>

<template>
  <div :class="class">
    <!-- Medium size button -->
    <button
      v-if="size === 'md'"
      type="submit"
      class="rounded-lg flex font-bold bg-stone-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none transition"
      :class="{ 'cursor-not-allowed bg-stone-400': disabled }"
      :disabled="disabled"
      @click="handleClick">
      <span>{{ addToCartButtonText }}</span>
      <LoadingIcon 
        v-if="isLoading" 
        stroke="4" 
        size="12" 
        color="#fff" 
      />
    </button>

    <!-- Small size button wrapper -->
    <div v-else-if="size === 'sm'" class="inline-block">
      <PhosphorIconPlusCircle
        v-if="!isLoading"
        type="submit"
        class="w-[48px] h-[48px] hover:text-Primary cursor-pointer transition rounded-lg flex font-bold text-center gap-4 items-center justify-center focus:outline-none"
        :class="{ 'cursor-not-allowed opacity-50': disabled }"
        :disabled="disabled"
        @click="handleClick"
      />
      <LoadingIcon 
        v-if="isLoading" 
        stroke="4" 
        size="46" 
        color="#ffad32" 
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
button, .icon-button {
  outline: none !important;
}

/* Removing the old button.disabled style since we're now handling it inline */
</style>