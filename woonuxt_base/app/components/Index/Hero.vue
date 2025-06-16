<template>
    <section class="relative z-10 w-full pb-20 md:pb-56 md:-mt-14">
        <NuxtImg src="/img/hero-bg.jpg" class="absolute inset-0 z-0 object-cover w-full h-full -top-12"/>
        <div class="pt-[100px] md:pt-[250px] container">
            <div class="gap-[24px] bg-white relative z-10 flex items-center justify-center flex-col p-6 md:p-[50px] lg:mx-56">
                <NuxtImg src="/img/hero-logo.svg" class="absolute -top-[70px] md:-top-[100px] w-[120px] md:w-[180px]"/>
                <h1 class="text-4xl md:text-[64px] text-center font-titoli">ITÁLIA PIZZÉRIA</h1>
                <div class="h-[4px] bg-red w-full max-w-[392px]"/>
                <p class="text-[14px] text-grey leading-[200%] text-center">Az ITÁLIA PIZZÉRIA és ÉTTEREM Kaposvár egyik csendes, belvároshoz közeli utcájában található. Az idelátogatókat széles választékú étlap mellett hangulatos környezet és rendkívül udvarias kiszolgálás várja. Kellemes nyári időben lehetőség van kiülni a teraszunkra is.</p>
                <NuxtLink to="/products" class="w-full bg-black button md:w-auto">
                    Megnézem a menüt
                </NuxtLink>
            </div>
        </div>

        <NuxtImg src="/img/szep.svg" class="absolute left-0 hidden h-fit -bottom-[29px] md:block w-[200px]"/>

    </section>
</template>