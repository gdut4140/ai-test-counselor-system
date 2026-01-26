import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    // State
    const notificationSettings = ref([
        { id: 1, label: '新的预约申请', email: true, push: true, sms: false },
        { id: 2, label: '活动报名提醒', email: true, push: true, sms: false },
        { id: 3, label: '学生异常考勤预警', email: true, push: true, sms: true },
        { id: 4, label: '系统公告', email: false, push: true, sms: false },
    ])

    // Actions
    function updateNotificationSetting(id, type, value) {
        const setting = notificationSettings.value.find(s => s.id === id)
        if (setting) {
            setting[type] = value
        }
    }

    return {
        notificationSettings,
        updateNotificationSetting
    }
})
