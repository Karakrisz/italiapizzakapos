<script setup>
const links = [
    { name: "Rólunk", link: "/rolunk" },
    { name: "Galéria", link: "/galeria" },
    { name: "Étlap", link: "/products" },
    { name: "Kapcsolat", link: "/kapcsolat" },
    { name: "Rendelés", link: "/" },
];
</script>

<template>
    <InfoCards class="md:hidden" />
    <footer class="relative w-full text-white">
        <div class="container relative z-10 px-4 pb-10 md:px-0">
            <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[50px] pt-[50px] md:pt-[90px]">
                <div class="flex flex-col gap-[15px] z-10 w-full md:flex-1 order-3 md:order-1">
                    <NuxtLink v-for="link in links" :key="link.name" :to="link.link" class="font-bold text-center uppercase md:text-right hover:text-stone-200 transition">{{ link.name }}</NuxtLink>
                </div>
                <NuxtImg class="w-[200px] md:w-[250px] order-1 md:order-2" src="/img/footer-logo.svg" />
                <div class="flex-1 order-2 w-full md:w-auto md:order-3">
                    <h3 class="font-semibold text-[15px] pb-[15px] text-center md:text-left">Kapcsolat</h3>
                    <div class="flex flex-col gap-[15px]">
                        <div class="flex gap-[5px] items-center justify-center md:justify-start">
                            <PhosphorIconDeviceMobile size="24" class="text-pizza-red"/> +36 30 244 7799
                        </div>
                        <div class="flex gap-[5px] items-center justify-center md:justify-start">
                            <PhosphorIconPhone size="24" class="text-pizza-red" /> 06 82 420 420
                        </div>
                        <div class="flex gap-[5px] items-center justify-center md:justify-start">
                            <PhosphorIconMapPin size="24" class="text-pizza-red" /> 7400 Kaposvár, Németh István fasor 69.
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center pt-[24px]">
                <PhosphorIconFacebookLogo weight="fill" size="40" class="inline-block text-white" />
                <PhosphorIconEnvelope weight="fill" size="40" class="inline-block text-white ml-[20px]" />
            </div>

        </div>
        <NuxtImg src="/img/szep.svg" class="absolute left-0 bottom-[96px] block md:hidden w-[120px] z-30"/>

        <div class="w-full bg-black py-4 md:h-[58px] relative z-10 mix-blend-difference flex justify-between px-4 md:px-10 ">
            <div class="flex flex-col md:flex-row gap-2 md:gap-6 md:justify-start text-white font-medium text-[14px]">
                <span class="font-semibold text-[15px]">Nyitvatartás</span>
                <span>Hétfő - 10:00 - 21:00</span>
                <span>Kedd-Szombat - 10:00 - 22:00</span>
                <span>Vasárnap - 12:00 - 21:00</span>
            </div>
            <NuxtImg src="/digital-seed-studio/logo-h.svg" class="w-20"/>
        </div>



        <NuxtImg src="/img/footer-bg.jpg" class="absolute top-0 z-0 object-cover w-full h-full" />
    </footer>
</template>