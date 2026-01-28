<script setup lang="ts">
import { computed } from 'vue'
import { useStatusMap } from '../composables/useStatusMap'

interface Props {
    status: string
    label?: string | null
    size?: 'sm' | 'md'
    showDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: null,
    size: 'sm',
    showDot: false
})

const { getStatusClass, getStatusLabel } = useStatusMap()

const sizeClass = computed(() => {
    if (props.size === 'md') return 'badge-md'
    return 'badge-sm'
})

const dotClass = computed(() => {
    const map: Record<string, string> = {
        warning: 'status-warning',
        leave: 'status-leave',
        ongoing: 'status-ongoing',
        registering: 'status-registering',
        ended: 'status-ended',
        active: 'status-active',
        inactive: 'status-inactive',
    }
    return map[props.status] || 'status-inactive'
})

const resolvedLabel = computed(() => props.label || getStatusLabel(props.status))
</script>

<template>
    <span class="status-badge" :class="[getStatusClass(status), sizeClass]">
        <span v-if="showDot" class="status-dot" :class="dotClass"></span>
        {{ resolvedLabel }}
    </span>
</template>
