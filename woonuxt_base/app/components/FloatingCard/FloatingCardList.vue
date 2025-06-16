<template>
    <div class="fixed right-0 z-40 md:flex flex-col space-y-4 top-[250px] hidden pointer-events-none">
        <FloatingCardItem>
            <template #icon>
                <PhosphorIconTruck :size="32" class="text-pizza-red" />
            </template>
            <template #text>
                <div class="text-[15px]">
                    <span class="font-bold">Házhozszállítás:</span>
                    <ul>
                        <li>
                            - Kaposváron 1300 Ft feletti rendelés esetén ingyenes
                        </li>
                        <li>
                            - Toponáron és Kaposfüreden 6000 Ft feletti rendelés esetén ingyenes
                        </li>
                        <li>
                            - Egyetemre és kollégiumba díjmentes
                        </li>
                    </ul>
                </div>
            </template>
        </FloatingCardItem>
        <FloatingCardItem>
            <template #icon>
                <PhosphorIconGift :size="32" class="text-pizza-red" />
            </template>
            <template #text>
                <div class="text-[15px]">
                    <span>8600 Ft rendelés felett ajándékba küldünk 1L Coca-Colát</span>
                </div>
            </template>
        </FloatingCardItem>
        <FloatingCardItem>
            <template #icon>
                <PhosphorIconClock :size="32" class="text-pizza-red" />
            </template>
            <template #text>
                <div class="text-[15px]">
                    <span>Kiszállítási idő átlagosan: 40-90 perc, forgalomtól függően</span>
                </div>
            </template>
        </FloatingCardItem>
        <FloatingCardItem>
            <template #icon>
                <PhosphorIconStar :size="32" class="text-pizza-red" />
            </template>
            <template #text>
                <div class="text-[15px]">
                    <span>Fél adag rendelése esetén az ár 70%-át számoljuk fel</span>
                </div>
            </template>
        </FloatingCardItem>
    </div>
</template>