<script setup lang="ts">
const links = [
  { name: 'Rólunk', link: '/rolunk', prefetch: true },
  { name: 'Galéria', link: '/galeria' },
  { name: 'Étlap', link: '/products', prefetch: true },
  { name: 'Kapcsolat', link: '/kapcsolat' },
];
</script>

<template>
  <div class="bg-black w-full md:py-2 md:h-[60px] relative z-30">
    <div
      class="container hidden md:flex flex-col md:flex-row md:items-center md:justify-end h-full text-white gap-2 md:gap-[25px] text-xs md:text-sm px-4 md:pr-[50px]">
      <div class="flex gap-[5px] items-center font-bold"><PhosphorIconDeviceMobile size="24" class="text-pizza-red" /> +36 30 244 7799</div>
      <div class="flex gap-[5px] items-center font-bold"><PhosphorIconPhone size="24" class="text-pizza-red" /> 06 82 420 420</div>
      <div class="flex gap-[5px] items-center"><PhosphorIconMapPin size="24" class="text-pizza-red" /> 7400 Kaposvár, Németh István fasor 69.</div>
    </div>
  </div>

  <header class="z-50 sticky top-0">
    <div class="md:h-[59px] h-3 bg-pizza-red w-full" />

    <div class="xl:container shadow-md bg-pizza-yellow relative z-10 px-4 md:px-[42px] py-2 sm:py-4 md:py-[15px] flex justify-between items-center">
      <MenuTrigger class="lg:hidden" />

      <NuxtLink to="/" class="md:mb-0 md:absolute md:left-[50px] md:ml-12 lg:ml-0 md:bottom-[10px]">
        <NuxtImg src="/img/logo.svg" class="h-[70px] md:h-[141px] sm:relative absolute sm:top-0 -top-3.5 mx-auto translate-x-1/2 right-1/2" />
      </NuxtLink>
      <div class="mb-4 md:mb-0 pl-[200px] hidden md:block">
        <p class="pb-[3px] text-[15px] font-semibold">Nyitvatartás</p>
        <div class="text-[13px] font-medium leading-[121.029%]">
          <p>H - 10-21</p>
          <p>K-Szo - 10-22</p>
          <p>V - 12-21</p>
        </div>
      </div>
      <div class="xl:space-x-[50px] space-x-[30px] flex-col lg:flex md:flex-row items-center hidden">
        <NuxtLink v-for="link in links" :key="link.name" :to="link.link" class="mb-2 font-bold uppercase md:mb-0 hover:text-stone-700 transition">{{ link.name }}</NuxtLink>
        <!-- <button class="bg-pizza-red button">Rendelés</button> -->
      </div>
      <CartTrigger />
    </div>
  </header>
</template>
