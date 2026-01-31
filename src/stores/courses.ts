import axios from 'axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type CourseStatus = 'ongoing' | 'ended' | 'registering'

export interface Course {
    id: number
    name: string
    code: string
    status: CourseStatus
    attendance: string
    time: string
    location: string
    teacher: string
}

export const useCourseStore = defineStore('courses', () => {
    const courses = ref<Course[]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    let initialized = false

    const ongoingCourses = computed(() => courses.value.filter(c => c.status === 'ongoing'))

    async function fetchCourses() {
        isLoading.value = true
        error.value = null
        try {
            const { data } = await axios.get<Course[]>('/mock/courses.json')
            courses.value = data
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load courses')
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchCourses()
    }

    function addCourse(course: Omit<Course, 'id' | 'status' | 'attendance'> & Partial<Pick<Course, 'status' | 'attendance'>>) {
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
