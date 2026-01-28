import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCourseStore = defineStore('courses', () => {
    // State
    const courses = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    let initialized = false

    // Getters
    const ongoingCourses = computed(() => courses.value.filter(c => c.status === 'ongoing'))

    // Actions
    async function fetchCourses() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/mock/courses.json')
            if (!response.ok) throw new Error('Failed to load courses')
            courses.value = await response.json()
        } catch (err) {
            error.value = err
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchCourses()
    }

    function addCourse(course) {
        courses.value.push({
            id: Date.now(),
            status: 'ongoing',
            attendance: '0%',
            ...course
        })
    }

    init()

    return {
        courses,
        isLoading,
        error,
        ongoingCourses,
        fetchCourses,
        init,
        addCourse
    }
})
