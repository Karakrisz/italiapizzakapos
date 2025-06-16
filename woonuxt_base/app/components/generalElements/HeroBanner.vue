<template>
  <div class="relative overflow-hidden text-white -mt-[141px]">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <NuxtImg
        class="w-full h-full object-cover object-bottom mb-22"
        src="/img/IMG_HeroBg.png"
        alt="Hero image"
        loading="eager"
        sizes="sm:100vw md:1400px"
        fetchpriority="high"
        preload
        placeholder
        placeholder-class="blur-xl" />
      <!-- <img src="/img/flame.gif" class="w-full h-full z-10 absolute top-0 opacity-10 blur-lg" /> -->
    </div>

    <!-- Content Wrapper with minimum height to ensure visibility -->
    <div class="relative min-h-[875px] pt-[20px] z-20">
      <!-- Hero Title -->
      <NuxtImg src="/img/svg/SVG_Logo.svg" class="w-32 mx-auto pt-24 lg:hidden" />

      <div class="pt-[40px] md:pt-[80px] lg:pt-[130px] w-full">
        <h1 class="text-5xl md:text-6xl lg:text-[150px] text-center uppercase">Harapj rá</h1>
      </div>

      <!-- Main Content Container -->
      <div class="container mx-auto px-4 md:px-6 lg:px-8 mt-8 lg:-mt-20">
        <div class="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-32">
          <!-- Left Column  -->
          <div class="flex flex-col text-base md:text-lg lg:text-xl gap-7 items-start lg:items-end text-center lg:text-right flex-1 pb-12 lg:pb-0">
            <div class="flex flex-row-reverse md:flex-row gap-3 lg:gap-5 items-center">
              <div class="lg:hidden">Csak a <span class="font-semibold">legjobb</span> alapanyagokból</div>
              <div class="hidden lg:block">Csak a <span class="font-semibold">legjobb</span><br />alapanyagokból</div>
              <NuxtImg src="/img/svg/SVG_quality.svg" height="36" class="w-8 md:w-auto"></NuxtImg>
            </div>
            <div class="flex flex-row-reverse md:flex-row gap-3 lg:gap-5 items-center">
              <div class="lg:hidden">Kérd <span class="font-semibold">extra</span> csípős szósszal</div>
              <div class="hidden lg:block">Kérd <span class="font-semibold">extra</span><br />csípős szósszal</div>
              <NuxtImg src="/img/svg/SVG_hot-deal.svg" height="36" class="w-8 md:w-auto"></NuxtImg>
            </div>
            <div class="flex flex-row-reverse md:flex-row gap-3 lg:gap-5 items-center">
              <div class="lg:hidden"><span class="font-semibold">Gluténmentes</span> opció</div>
              <div class="hidden lg:block"><span class="font-semibold">Gluténmentes</span><br />opció</div>
              <NuxtImg src="/img/svg/SVG_gluten.svg" height="36" class="w-8 md:w-auto"></NuxtImg>
            </div>
          </div>

          <!-- Center Image -->
          <div class="flex-shrink-0">
            <NuxtImg src="/img/IMG_HeroHamburgerNoBG.png" class="w-[250px] md:w-[400px] lg:w-[550px] mx-auto" :width="550" />
          </div>

          <!-- Right Column -->
          <div class="flex-1 space-y-4 text-center lg:text-left">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold">Arhur Király Burger</h2>
            <p class="text-sm md:text-base lg:text-lg max-w-md mx-auto lg:mx-0">
              Egy igazi lovagi lakoma! Dupla marhahús, olvadt cheddar, ropogós bacon és pirított szalámi találkozik friss zöldségekkel, baconnaisse és
              mézes-mustáros szósz koronázásával.
            </p>
            <div
              class="cursor-pointer rounded-full h-[45px] w-fit mx-auto lg:mx-0 pr-2 bg-Light text-Dark flex items-center pl-5 font-semibold gap-[15px] glow">
              <span>Kosárba rakom</span>
              <NuxtImg class="w-[26px]" src="img/svg/SVG_Plus.svg"></NuxtImg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const offset = ref(0);

const handleScroll = () => {
  offset.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes wave {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
