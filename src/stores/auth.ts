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

interface ApiResponse<T> {
    code: number
    msg: string
    data: T
}

export interface ResetPasswordPayload {
    username?: string
    email?: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)

    const isAuthenticated = computed(() => !!token.value)
    const currentUser = computed(() => user.value)

    async function login(_credentials: Credentials) {
        isLoading.value = true
        try {
            const response = await fetch('/mock/api/admin/user/login.json')
            if (!response.ok) throw new Error('登录失败')
            const payload = (await response.json()) as ApiResponse<string>
            if (payload.code !== 200) throw new Error(payload.msg || '登录失败')
            token.value = payload.data
            user.value = {
                id: 1,
                name: '王老师',
                role: 'counselor',
                roleName: '辅导员',
                avatar: null,
                college: '自动化学院'
            }
            localStorage.setItem('token', token.value)
            return true
        } finally {
            isLoading.value = false
        }
    }

    async function logout() {
        try {
            await fetch('/mock/api/admin/user/logout.json')
        } finally {
            token.value = null
            user.value = null
            localStorage.removeItem('token')
        }
    }

    async function updatePassword(oldPassword: string, newPassword: string) {
        const response = await fetch('/mock/api/admin/user/password/update.json')
        if (!response.ok) throw new Error('修改密码失败')
        const payload = (await response.json()) as ApiResponse<null>
        if (payload.code !== 200) throw new Error(payload.msg || '修改密码失败')
        return { oldPassword, newPassword }
    }

    async function requestPasswordReset(_payload: ResetPasswordPayload) {
        const response = await fetch('/mock/api/admin/user/password/reset.json')
        if (!response.ok) throw new Error('重置密码申请失败')
        const payload = (await response.json()) as ApiResponse<null>
        if (payload.code !== 200) throw new Error(payload.msg || '重置密码申请失败')
        return true
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
        updatePassword,
        requestPasswordReset,
        init
    }
})
