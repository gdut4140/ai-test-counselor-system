import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    // State
    const user = ref(null)
    const token = ref(null)
    const isLoading = ref(false)

    // Getters
    const isAuthenticated = computed(() => !!token.value)
    const currentUser = computed(() => user.value)

    // Actions
    function login(credentials) {
        isLoading.value = true
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                token.value = 'mock-jwt-token'
                user.value = {
                    id: 1,
                    name: '王老师',
                    role: 'counselor',
                    roleName: '辅导员',
                    avatar: null, // default handling in UI
                    college: '自动化学院'
                }
                localStorage.setItem('token', token.value)
                isLoading.value = false
                resolve(true)
            }, 1000)
        })
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        // Redirect logic is usually handled in component or router guard, 
        // but store can just clear state.
    }

    // Initialize from storage
    function init() {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            token.value = storedToken
            // Mock restoring user
            user.value = {
                id: 1,
                name: '王老师',
                role: 'counselor',
                roleName: '辅导员',
                college: '自动化学院'
            }
        }
    }

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        currentUser,
        login,
        logout,
        init
    }
})
