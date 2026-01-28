import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ActivityStatus = 'registering' | 'ongoing' | 'ended'
export type PublishStatus = 'published' | 'unpublished'

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
    publishStatus?: PublishStatus
    description?: string
    registrationStartTime?: string
    registrationEndTime?: string
    endTime?: string
    instructorId?: number
    instructorPhone?: string
}

export interface ActivityCreateInput {
    title: string
    type: string
    startTime: string
    location: string
    maxParticipants: number
    description?: string
}

interface ActivityApiItem {
    activityId: number
    activityName: string
    activityType: string
    imageUrl: string
    startTime: string
    endTime: string
    registrationStartTime: string
    registrationEndTime: string
    location: string
    maxParticipants: number
    instructorId: number
    instructorPhone: string
    description: string
    status: ActivityStatus
    publishStatus: PublishStatus
}

interface ApiResponse<T> {
    code: number
    msg: string
    data: T
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

    function mapApiItem(item: ActivityApiItem): Activity {
        return {
            id: item.activityId,
            title: item.activityName,
            type: item.activityType,
            status: item.status,
            startTime: item.startTime,
            location: item.location,
            participants: Math.min(item.maxParticipants, Math.floor(item.maxParticipants * 0.4)),
            maxParticipants: item.maxParticipants,
            cover: item.publishStatus === 'published' ? 'cover-indigo' : 'cover-amber',
            publishStatus: item.publishStatus,
            description: item.description,
            registrationStartTime: item.registrationStartTime,
            registrationEndTime: item.registrationEndTime,
            endTime: item.endTime,
            instructorId: item.instructorId,
            instructorPhone: item.instructorPhone
        }
    }

    async function fetchActivities() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/api/admin/activity/list.json')
            if (!response.ok) throw new Error('Failed to load activities')
            const payload = (await response.json()) as ApiResponse<ActivityApiItem[]>
            if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load activities')
            items.value = payload.data.map(mapApiItem)
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load activities')
        } finally {
            isLoading.value = false
        }
    }

    async function fetchActivityDetail(activityId: number) {
        const response = await fetch('/mock/api/admin/activity/detail.json')
        if (!response.ok) throw new Error('Failed to load activity detail')
        const payload = (await response.json()) as ApiResponse<ActivityApiItem>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load activity detail')
        return mapApiItem(payload.data)
    }

    async function createActivity(input?: Partial<ActivityCreateInput>) {
        const response = await fetch('/mock/api/admin/activity/create.json')
        if (!response.ok) throw new Error('Failed to create activity')
        const payload = (await response.json()) as ApiResponse<ActivityApiItem>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to create activity')
        const mapped = mapApiItem(payload.data)
        const merged: Activity = {
            ...mapped,
            ...input,
            participants: 0,
            status: 'registering',
            publishStatus: 'unpublished',
            cover: 'cover-amber'
        }
        items.value.unshift(merged)
        return merged
    }

    async function updateActivity(activityId: number) {
        const response = await fetch('/mock/api/admin/activity/update.json')
        if (!response.ok) throw new Error('Failed to update activity')
        const payload = (await response.json()) as ApiResponse<ActivityApiItem>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to update activity')
        const mapped = mapApiItem(payload.data)
        const index = items.value.findIndex(item => item.id === activityId)
        if (index >= 0) items.value[index] = mapped
        return mapped
    }

    async function publishActivity(activityId: number) {
        const response = await fetch('/mock/api/admin/activity/publish.json')
        if (!response.ok) throw new Error('Failed to publish activity')
        const payload = (await response.json()) as ApiResponse<null>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to publish activity')
        const target = items.value.find(item => item.id === activityId)
        if (target) target.publishStatus = 'published'
        return true
    }

    async function unpublishActivity(activityId: number) {
        const response = await fetch('/mock/api/admin/activity/unpublish.json')
        if (!response.ok) throw new Error('Failed to unpublish activity')
        const payload = (await response.json()) as ApiResponse<null>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to unpublish activity')
        const target = items.value.find(item => item.id === activityId)
        if (target) target.publishStatus = 'unpublished'
        return true
    }

    async function deleteActivity(activityId: number) {
        const response = await fetch('/mock/api/admin/activity/delete.json')
        if (!response.ok) throw new Error('Failed to delete activity')
        const payload = (await response.json()) as ApiResponse<null>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to delete activity')
        items.value = items.value.filter(item => item.id !== activityId)
        return true
    }

    async function fetchActivityRegistrations(_activityId: number) {
        const response = await fetch('/mock/api/admin/activity/registration/detail.json')
        if (!response.ok) throw new Error('Failed to load registrations')
        const payload = (await response.json()) as ApiResponse<unknown[]>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load registrations')
        return payload.data
    }

    async function handleActivityRegistration(_registrationId: number, _action: string) {
        const response = await fetch('/mock/api/admin/activity/registration/handle.json')
        if (!response.ok) throw new Error('Failed to handle registration')
        const payload = (await response.json()) as ApiResponse<null>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to handle registration')
        return true
    }

    async function fetchActivityParticipation(_activityId: number) {
        const response = await fetch('/mock/api/admin/activity/participation.json')
        if (!response.ok) throw new Error('Failed to load participation')
        const payload = (await response.json()) as ApiResponse<unknown[]>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load participation')
        return payload.data
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchActivities()
    }

    init()

    return {
        items,
        isLoading,
        error,
        todayActivitiesCount,
        registeringCount,
        fetchActivities,
        fetchActivityDetail,
        fetchActivityRegistrations,
        fetchActivityParticipation,
        handleActivityRegistration,
        createActivity,
        updateActivity,
        publishActivity,
        unpublishActivity,
        deleteActivity,
        init
    }
})
