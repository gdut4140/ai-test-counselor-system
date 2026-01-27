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
    if (props.size === 'md') return 'px-3 py-1 text-sm'
    return 'px-2.5 py-0.5 text-xs'
})

const dotClass = computed(() => {
    const map = {
        pending: 'bg-amber-500',
        approved: 'bg-emerald-500',
        rejected: 'bg-rose-500',
        warning: 'bg-amber-500',
        leave: 'bg-blue-500',
        ongoing: 'bg-emerald-500',
        registering: 'bg-indigo-500',
        ended: 'bg-slate-400',
        active: 'bg-emerald-500',
        inactive: 'bg-slate-400',
    }
    return map[props.status] || 'bg-slate-400'
})

const resolvedLabel = computed(() => props.label || getStatusLabel(props.status))
</script>

<template>
    <span class="inline-flex items-center rounded-full border font-medium" :class="[getStatusClass(status), sizeClass]">
        <span v-if="showDot" class="w-1.5 h-1.5 rounded-full mr-1.5" :class="dotClass"></span>
        {{ resolvedLabel }}
    </span>
</template>
