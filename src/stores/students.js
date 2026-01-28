import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStudentStore = defineStore('students', () => {
    // State
    const items = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    let initialized = false

    // Getters
    const totalCount = computed(() => items.value.length)
    const warningCount = computed(() => items.value.filter(s => s.status === 'warning').length)

    // Actions
    async function fetchStudents() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/students.json')
            if (!response.ok) throw new Error('Failed to load students')
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
