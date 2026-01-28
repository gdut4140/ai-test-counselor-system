import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type StudentStatus = 'active' | 'leave' | 'warning'

export interface Student {
    id: number
    name: string
    studentNo: string
    class: string
    major: string
    phone: string
    email: string
    status: StudentStatus
}

export const useStudentStore = defineStore('students', () => {
    const items = ref<Student[]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    let initialized = false

    const totalCount = computed(() => items.value.length)
    const warningCount = computed(() => items.value.filter(s => s.status === 'warning').length)

    async function fetchStudents() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/students.json')
            if (!response.ok) throw new Error('Failed to load students')
            items.value = (await response.json()) as Student[]
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load students')
        } finally {
            isLoading.value = false
        }
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
        totalCount,
        warningCount,
        fetchStudents,
        init
    }
})
