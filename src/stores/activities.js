import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivityStore = defineStore('activities', () => {
    // State
    const items = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    let initialized = false

    // Getters
    const todayActivitiesCount = computed(() => {
        // Mock logic: simply return a fixed number or filter by date date string matching today in real app
        return 3
    })

    const registeringCount = computed(() => items.value.filter(i => i.status === 'registering').length)

    // Actions
    async function fetchActivities() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/activities.json')
            if (!response.ok) throw new Error('Failed to load activities')
            items.value = await response.json()
        } catch (err) {
            error.value = err
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchActivities()
    }

    function addActivity(activity) {
        items.value.unshift(activity)
    }

    init()

    return {
        items,
        isLoading,
        error,
        todayActivitiesCount,
        registeringCount,
        fetchActivities,
        init,
        addActivity
    }
})
