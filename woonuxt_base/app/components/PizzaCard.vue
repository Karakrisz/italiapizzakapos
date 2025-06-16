<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    pizzaName: String,
    imgSrc: String,
    description: String,
    sizes: {
        type: Array,
        default: () => ['22cm', '28cm', '32cm', '45cm']
    },
    prices: {
        type: Object,
        default: () => ({
            '22cm': { original: 1850, discounted: 1550 },
            '28cm': { original: 2050, discounted: 1750 },
            '32cm': { original: 2250, discounted: 1950 },
            '45cm': { original: 2650, discounted: 2350 }
        })
    }
});

const selectedSize = ref(props.sizes[0]);

const currentPrice = computed(() => props.prices[selectedSize.value]);

const selectSize = (size) => {
    selectedSize.value = size;
};
</script>

<template>
    <div class="flex flex-col gap-[20px]">
        <div class="w-full h-[216px] relative">
            <NuxtImg :src="imgSrc" alt="Pizza Image" class="object-cover w-full h-full" />
        </div>
        <h3 class="text-[20px] font-bold uppercase">{{ pizzaName }}</h3>
        <div class="flex space-x-2">
            <button
v-for="size in sizes" :key="size" :class="[
                'px-2.5 py-1 font-medium transition-colors duration-200 border border-black',
                selectedSize === size
                    ? 'bg-black text-white'
                    : 'bg-transparent text-black hover:bg-gray-100'
            ]" @click="selectSize(size)">
                {{ size }}
            </button>
        </div>
        <div class="flex gap-[15px] items-center">
            <span class="line-through text-gray text-[14px] uppercase">{{ currentPrice.original }} Ft</span>
            <span class="text-[20px] uppercase text-pizza-red font-bold">{{ currentPrice.discounted }} Ft</span>
        </div>
        <p class="text-[14px] leading-[150%] flex-1">
            {{ description }}
        </p>
        <NuxtLink :to="'/'" class="w-full bg-pizza-green button">MEGRENDELEM</NuxtLink>
    </div>
</template>