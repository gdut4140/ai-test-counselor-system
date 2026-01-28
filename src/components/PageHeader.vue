<script setup lang="ts">
interface Props {
    title: string
    subtitle?: string
}

withDefaults(defineProps<Props>(), {
    subtitle: ''
})
</script>

<template>
    <div class="page-header">
        <div>
            <h2 class="page-title">{{ title }}</h2>
            <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="page-actions">
            <slot name="actions" />
        </div>
    </div>
</template>
