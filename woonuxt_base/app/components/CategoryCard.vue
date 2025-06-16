<script setup lang="ts">
const { FALLBACK_IMG } = useHelpers();
const props = defineProps({
  node: { type: Object, required: true },
  imageLoading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
});

const imgWidth = 48;
</script>

<template>
  <NuxtLink
    v-if="node"
    :to="`/product-category/${decodeURIComponent(node.slug)}`"
    :prefetch="true"
    class="py-7 gap-[15px] bg-Light rounded-[30px] items-center flex justify-center item snap-mandatory snap-x transition glow">
    <NuxtImg
      :width="imgWidth"
      :height="imgWidth"
      class="relative z-10"
      :src="node.image?.sourceUrl || FALLBACK_IMG"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="imageLoading"
      :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
      placeholder
      placeholder-class="blur-xl" />
    <span class="text-[32px] font-maiden-orange relative z-10" v-html="node.name" />
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
</style>
