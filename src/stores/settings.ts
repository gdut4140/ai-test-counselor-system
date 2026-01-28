import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NotificationSetting {
    id: number
    label: string
    email: boolean
    push: boolean
    sms: boolean
}

type NotificationChannel = 'email' | 'push' | 'sms'

export const useSettingsStore = defineStore('settings', () => {
    const notificationSettings = ref<NotificationSetting[]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    let initialized = false

    async function fetchSettings() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/settings.mock.json')
            if (!response.ok) throw new Error('Failed to load settings')
            notificationSettings.value = (await response.json()) as NotificationSetting[]
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load settings')
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchSettings()
    }

    function updateNotificationSetting(id: number, type: NotificationChannel, value: boolean) {
        const setting = notificationSettings.value.find(s => s.id === id)
        if (setting) {
            setting[type] = value
        }
    }

    init()

    return {
        notificationSettings,
        isLoading,
        error,
        fetchSettings,
        init,
        updateNotificationSetting
    }
})
