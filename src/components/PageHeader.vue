<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold text-slate-900">{{ title }}</h2>
            <p v-if="subtitle" class="mt-1 text-slate-500">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="flex items-center gap-3">
            <slot name="actions" />
        </div>
    </div>
</template>
