import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    // State
    const notificationSettings = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    let initialized = false

    // Actions
    async function fetchSettings() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/settings.json')
            if (!response.ok) throw new Error('Failed to load settings')
            notificationSettings.value = await response.json()
        } catch (err) {
            error.value = err
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchSettings()
    }

    function updateNotificationSetting(id, type, value) {
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
