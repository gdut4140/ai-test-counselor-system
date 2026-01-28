<script setup>
import { computed } from 'vue'
import { useStatusMap } from '../composables/useStatusMap'

const props = defineProps({
    status: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: 'sm' // sm | md
    },
    showDot: {
        type: Boolean,
        default: false
    }
})

const { getStatusClass, getStatusLabel } = useStatusMap()

const sizeClass = computed(() => {
    if (props.size === 'md') return 'status-badge--md'
    return 'status-badge--sm'
})

const dotClass = computed(() => {
    const map = {
        warning: 'status-dot--warning',
        leave: 'status-dot--leave',
        ongoing: 'status-dot--ongoing',
        registering: 'status-dot--registering',
        ended: 'status-dot--ended',
        active: 'status-dot--active',
        inactive: 'status-dot--inactive',
    }
    return map[props.status] || 'status-dot--inactive'
})

const resolvedLabel = computed(() => props.label || getStatusLabel(props.status))
</script>

<template>
    <span class="status-badge" :class="[getStatusClass(status), sizeClass]">
        <span v-if="showDot" class="status-badge__dot" :class="dotClass"></span>
        {{ resolvedLabel }}
    </span>
</template>
