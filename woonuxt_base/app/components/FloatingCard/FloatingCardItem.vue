<template>
    <div class="pointer-events-auto -right-[600px] hover:right-0 transition-all relative w-[700px] bg-white group flex items-center gap-20 p-4 border rounded-l-lg cursor-pointer shadow-md">
        <slot name="icon"></slot>
        <slot name="text"></slot>
    </div>
</template>

<script setup>
defineProps({
    icon: String,
    text: String,
});
</script>

<style scoped>
.group-hover\\:opacity-100 {
    opacity: 1;
}
</style>
