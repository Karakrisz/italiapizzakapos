<template>
    <section class="border-t divide-y">
        <div class="flex items-center w-full gap-10 p-4 bg-white">
            <PhosphorIconTruck :size="32" class="text-red" />
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
        </div>
        <div class="flex items-center w-full gap-10 p-4 bg-white ">
            <PhosphorIconGift :size="32" class="text-red" />
            <div class="text-[15px]">
                <span>8600 Ft rendelés felett ajándékba küldünk 1L Coca-Colát</span>
            </div>
        </div>
        <div class="flex items-center w-full gap-10 p-4 bg-white ">
            <PhosphorIconClock :size="32" class="text-red" />
            <div class="text-[15px]">
                <span>Kiszállítási idő átlagosan: 40-90 perc, forgalomtól függően</span>
            </div>
        </div>
        <div class="flex items-center w-full gap-10 p-4 bg-white ">
            <PhosphorIconStar :size="32" class="text-red" />
            <div class="text-[15px]">
                <span>Fél adag rendelése esetén az ár 70%-át számoljuk fel</span>
            </div>
        </div>
    </section>
</template>