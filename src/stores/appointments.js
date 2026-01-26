import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppointmentStore = defineStore('appointments', () => {
    // State
    const items = ref([
        { id: 101, student: '张三', idNo: '2021001', type: '课程辅导', location: '心理咨询室A', time: '2026-01-26 10:00', status: 'pending', reason: '近期学习压力较大，希望能得到指导' },
        { id: 102, student: '李四', idNo: '2021002', type: '场地申请', location: '活动中心302', time: '2026-01-27 14:00', status: 'pending', reason: '班级团建活动需要场地' },
        { id: 103, student: '王五', idNo: '2021003', type: '特殊事项', location: '办公室', time: '2026-01-25 09:00', status: 'approved', reason: '请假签字' },
        { id: 104, student: '赵六', idNo: '2021004', type: '课程辅导', location: '线上会议', time: '2026-01-24 19:00', status: 'rejected', reason: '时间冲突' },
        { id: 105, student: '钱七', idNo: '2021005', type: '场地申请', location: '实验室B', time: '2026-01-28 15:30', status: 'pending', reason: '科研项目实验需要' },
    ])

    // Getters
    const pendingCount = computed(() => items.value.filter(i => i.status === 'pending').length)
    const recentAppointments = computed(() => [...items.value].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5))

    // Actions
    function updateStatus(id, newStatus) {
        const index = items.value.findIndex(i => i.id === id)
        if (index !== -1) {
            items.value[index].status = newStatus
        }
    }

    function addAppointment(appointment) {
        items.value.unshift({
            id: Date.now(),
            status: 'pending',
            ...appointment
        })
    }

    return {
        items,
        pendingCount,
        recentAppointments,
        updateStatus,
        addAppointment
    }
})
