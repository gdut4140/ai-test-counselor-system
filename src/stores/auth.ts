import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
    id: number
    name: string
    role: string
    roleName: string
    avatar?: string | null
    college: string
}

export interface Credentials {
    username?: string
    password?: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)

    const isAuthenticated = computed(() => !!token.value)
    const currentUser = computed(() => user.value)

    function login(_credentials: Credentials) {
        isLoading.value = true
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                token.value = 'mock-jwt-token'
                user.value = {
                    id: 1,
                    name: '王老师',
                    role: 'counselor',
                    roleName: '辅导员',
                    avatar: null,
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
    }

    function init() {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            token.value = storedToken
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
