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
    <div class="page-header">
        <div>
            <h2 class="page-header__title">{{ title }}</h2>
            <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="page-header__actions">
            <slot name="actions" />
        </div>
    </div>
</template>
