import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivityStore = defineStore('activities', () => {
    // State
    const items = ref([
        {
            id: 1,
            title: '2026春季校园歌手大赛',
            type: '文体活动',
            startTime: '2026-03-15 18:00',
            endTime: '2026-03-15 21:00',
            location: '学生活动中心大礼堂',
            participants: 45,
            maxParticipants: 100,
            status: 'registering',
            cover: 'bg-indigo-100 text-indigo-600'
        },
        {
            id: 2,
            title: '创新创业讲座：AI时代的机遇',
            type: '学术讲座',
            startTime: '2026-02-10 14:00',
            endTime: '2026-02-10 16:00',
            location: '图书馆报告厅',
            participants: 120,
            maxParticipants: 200,
            status: 'registering',
            cover: 'bg-blue-100 text-blue-600'
        },
        {
            id: 3,
            title: '诚信考试动员大会',
            type: '班级会议',
            startTime: '2026-01-20 10:00',
            endTime: '2026-01-20 11:30',
            location: '教三楼 305',
            participants: 58,
            maxParticipants: 60,
            status: 'ended',
            cover: 'bg-emerald-100 text-emerald-600'
        },
    ])

    // Getters
    const todayActivitiesCount = computed(() => {
        // Mock logic: simply return a fixed number or filter by date date string matching today in real app
        return 3
    })

    const registeringCount = computed(() => items.value.filter(i => i.status === 'registering').length)

    // Actions
    function addActivity(activity) {
        items.value.unshift(activity)
    }

    return {
        items,
        todayActivitiesCount,
        registeringCount,
        addActivity
    }
})
