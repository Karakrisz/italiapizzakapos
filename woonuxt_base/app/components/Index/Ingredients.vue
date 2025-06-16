<script setup>
const ingredients = [
    { name: '00-ás liszt', imgSrc: 'liszt.jpg' },
    { name: 'Paradicsom', imgSrc: 'paradicsom.jpg' },
    { name: 'Extra szűz olívaolaj', imgSrc: 'olivaolaj.jpg' },
    { name: 'Friss Rukkola', imgSrc: 'bazsalikom.jpg' },
    { name: 'Mozzarella', imgSrc: 'mozarella.jpg' }
]
</script>

<template>
    <section class="w-full">
        <h2 class="section-title py-6 md:py-[50px] w-full bg-pizza-yellow text-center">MIBŐL KÉSZÜL AZ IGAZI OLASZ PIZZA?</h2>
        <div class="flex flex-wrap w-full justify-stretch">
            <div v-for="ingredient in ingredients" :key="ingredient.name" class="w-full sm:w-1/2 md:w-1/3 lg:flex-1 relative h-[200px] md:h-[282px] flex items-center justify-center p-4 md:p-10 overflow-hidden">
                <h3 class="relative z-10 px-2 text-lg font-bold text-center text-white uppercase md:text-xl">{{ ingredient.name }}</h3>
                <NuxtImg :src="'/img/ingredients/' + ingredient.imgSrc" alt="Ingredient" class="absolute top-0 left-0 object-cover w-full h-full" />
            </div>
        </div>
    </section>
</template>