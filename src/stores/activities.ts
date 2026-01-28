import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ActivityStatus = 'registering' | 'ongoing' | 'ended'

export interface Activity {
    id: number
    title: string
    type: string
    status: ActivityStatus
    startTime: string
    location: string
    participants: number
    maxParticipants: number
    cover?: string
}

export const useActivityStore = defineStore('activities', () => {
    const items = ref<Activity[]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    let initialized = false

    const todayActivitiesCount = computed(() => {
        return 3
    })

    const registeringCount = computed(() => items.value.filter(i => i.status === 'registering').length)

    async function fetchActivities() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/activities.json')
            if (!response.ok) throw new Error('Failed to load activities')
            items.value = (await response.json()) as Activity[]
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load activities')
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchActivities()
    }

    function addActivity(activity: Activity) {
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
