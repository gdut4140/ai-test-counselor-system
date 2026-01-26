<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GraduationCap, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)

const handleLogin = () => {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        router.push('/dashboard')
    }, 1000)
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <div
                    class="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform -rotate-6">
                    <GraduationCap class="w-10 h-10 text-white" />
                </div>
                <h2 class="mt-6 text-3xl font-bold tracking-tight text-slate-900">辅导员管理系统</h2>
                <p class="mt-2 text-sm text-slate-600">
                    高效 · 简约 · 智能
                </p>
            </div>

            <div
                class="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                <form class="space-y-6" @submit.prevent="handleLogin">
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-700">工号 / 账号</label>
                        <div class="mt-1">
                            <input id="email" name="email" type="text" autocomplete="email" required
                                class="block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-all"
                                placeholder="请输入工号" value="teacher001" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-700">密码</label>
                        <div class="mt-1">
                            <input id="password" name="password" type="password" autocomplete="current-password"
                                required
                                class="block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-all"
                                value="password" />
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            class="group relative flex w-full justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            :disabled="isLoading">
                            <span v-if="!isLoading" class="flex items-center">
                                登录系统
                                <ArrowRight
                                    class="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <span v-else>登录中...</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
