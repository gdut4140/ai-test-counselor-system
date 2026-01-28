import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type StudentStatus = 'active' | 'leave' | 'warning'

export interface Student {
    id: number
    name: string
    studentNo: string
    class: string
    classId: number
    major: string
    college: string
    phone: string
    email: string
    status: StudentStatus
}

export interface AttendanceStatItem {
    studentId: number
    studentName: string
    studentIdNumber: string
    absentCount: number
}

export interface AttendanceStats {
    classId: number
    className: string
    attendanceRate: string
    absentList: AttendanceStatItem[]
}

interface StudentApiItem {
    id: number
    studentName: string
    studentIdNumber: string
    className: string
    classId: number
    major: string
    college: string
    phone: string
    email: string
    status: StudentStatus
}

interface ApiResponse<T> {
    code: number
    msg: string
    data: T
}

export const useStudentStore = defineStore('students', () => {
    const items = ref<Student[]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    const attendanceStats = ref<AttendanceStats | null>(null)
    let initialized = false

    const totalCount = computed(() => items.value.length)
    const warningCount = computed(() => items.value.filter(s => s.status === 'warning').length)

    function mapApiItem(item: StudentApiItem): Student {
        return {
            id: item.id,
            name: item.studentName,
            studentNo: item.studentIdNumber,
            class: item.className,
            classId: item.classId,
            major: item.major,
            college: item.college,
            phone: item.phone,
            email: item.email,
            status: item.status
        }
    }

    async function fetchStudents() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/api/admin/student/list.json')
            if (!response.ok) throw new Error('Failed to load students')
            const payload = (await response.json()) as ApiResponse<StudentApiItem[]>
            if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load students')
            items.value = payload.data.map(mapApiItem)
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load students')
        } finally {
            isLoading.value = false
        }
    }

    async function fetchStudentDetail(_studentId: number) {
        const response = await fetch('/mock/api/admin/student/detail.json')
        if (!response.ok) throw new Error('Failed to load student detail')
        const payload = (await response.json()) as ApiResponse<Record<string, unknown>>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load student detail')
        return payload.data
    }

    async function fetchStudentActivities(_studentId: number) {
        const response = await fetch('/mock/api/admin/student/registration/detail.json')
        if (!response.ok) throw new Error('Failed to load student activities')
        const payload = (await response.json()) as ApiResponse<unknown[]>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load student activities')
        return payload.data
    }

    async function fetchStudentAbsences(_studentId: number) {
        const response = await fetch('/mock/api/admin/student/absent/detail.json')
        if (!response.ok) throw new Error('Failed to load student absences')
        const payload = (await response.json()) as ApiResponse<unknown[]>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load student absences')
        return payload.data
    }

    async function fetchAttendanceStats(_classId: number) {
        const response = await fetch('/mock/api/admin/student/attendance/stat.json')
        if (!response.ok) throw new Error('Failed to load attendance stats')
        const payload = (await response.json()) as ApiResponse<AttendanceStats>
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load attendance stats')
        attendanceStats.value = payload.data
        return payload.data
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchStudents()
    }

    init()

    return {
        items,
        isLoading,
        error,
        attendanceStats,
        totalCount,
        warningCount,
        fetchStudents,
        fetchStudentDetail,
        fetchStudentActivities,
        fetchStudentAbsences,
        fetchAttendanceStats,
        init
    }
})
