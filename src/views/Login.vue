<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GraduationCap, ArrowRight, X } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const isLoading = ref(false)
const loginError = ref('')
const username = ref('teacher001')
const password = ref('password')
const showResetModal = ref(false)
const resetAccount = ref('')
const resetEmail = ref('')
const resetError = ref('')
const resetSuccess = ref('')
const isResetting = ref(false)

const authStore = useAuthStore()

const handleLogin = async () => {
    isLoading.value = true
    loginError.value = ''
    try {
        const success = await authStore.login({ username: username.value, password: password.value })
        if (success) {
            router.push('/dashboard')
        }
    } catch (error) {
        loginError.value = error instanceof Error ? error.message : '登录失败，请稍后再试'
    } finally {
        isLoading.value = false
    }
}

const openResetModal = () => {
    showResetModal.value = true
    resetError.value = ''
    resetSuccess.value = ''
}

const closeResetModal = () => {
    showResetModal.value = false
    resetError.value = ''
    resetSuccess.value = ''
}

const handleResetSubmit = async () => {
    if (isResetting.value) return
    resetError.value = ''
    resetSuccess.value = ''

    if (!resetAccount.value && !resetEmail.value) {
        resetError.value = '请输入工号或邮箱。'
        return
    }

    isResetting.value = true
    try {
        await authStore.requestPasswordReset({ username: resetAccount.value, email: resetEmail.value })
        resetSuccess.value = '已提交申请，请联系管理员或等待短信通知。'
        resetAccount.value = ''
        resetEmail.value = ''
    } catch (error) {
        resetError.value = error instanceof Error ? error.message : '提交失败，请稍后再试'
    } finally {
        isResetting.value = false
    }
}
</script>

<template>
    <div class="login">
        <div class="login-container">
            <div class="login-brand">
                <div class="login-logo">
                    <GraduationCap class="icon" />
                </div>
                <h2 class="login-title">辅导员管理系统</h2>
                <p class="login-subtitle">高效 · 简约 · 智能</p>
            </div>

            <div class="login-card">
                <form class="login-form" @submit.prevent="handleLogin">
                    <div class="form-field">
                        <label for="email" class="form-label">工号 / 账号</label>
                        <input id="email" v-model="username" name="email" type="text" autocomplete="email" required
                            class="input" placeholder="请输入工号" />
                    </div>

                    <div class="form-field">
                        <label for="password" class="form-label">密码</label>
                        <input id="password" v-model="password" name="password" type="password"
                            autocomplete="current-password" required class="input" />
                    </div>

                    <button type="button" class="forgot-link" @click="openResetModal">忘记密码？</button>

                    <p v-if="loginError" class="login-error">{{ loginError }}</p>

                    <div class="login-actions">
                        <button type="submit" class="btn btn-primary login-submit" :disabled="isLoading">
                            <span v-if="!isLoading" class="login-button">
                                登录系统
                                <ArrowRight class="icon icon-sm login-icon" />
                            </span>
                            <span v-else>登录中...</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showResetModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-backdrop" @click="closeResetModal"></div>
            <div class="modal-card">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">找回密码</h3>
                        <p class="modal-subtitle">请输入工号或绑定邮箱，我们会通知管理员协助重置。</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" @click="closeResetModal">
                        <X class="icon" />
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-field">
                        <label class="form-label">工号</label>
                        <input v-model="resetAccount" type="text" class="input" placeholder="请输入工号" />
                    </div>
                    <div class="form-field">
                        <label class="form-label">邮箱</label>
                        <input v-model="resetEmail" type="email" class="input" placeholder="请输入邮箱" />
                    </div>

                    <p v-if="resetError" class="form-error">{{ resetError }}</p>
                    <p v-if="resetSuccess" class="form-success">{{ resetSuccess }}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline" @click="closeResetModal">取消</button>
                    <button class="btn btn-primary" :disabled="isResetting" @click="handleResetSubmit">
                        <span v-if="!isResetting">提交申请</span>
                        <span v-else>提交中...</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens' as *;

.login {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    background: $color-background;

    .login-container {
        width: 100%;
        max-width: 420px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .login-brand {
        text-align: center;

        .login-logo {
            width: 64px;
            height: 64px;
            margin: 0 auto;
            border-radius: 18px;
            background: $color-primary;
            color: $color-white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 12px 24px rgba(124, 58, 237, 0.25);
            transform: rotate(-6deg);
        }

        .login-title {
            margin-top: 20px;
            font-size: 28px;
            font-weight: 700;
        }

        .login-subtitle {
            margin-top: 8px;
            font-size: 14px;
            color: $color-slate-600;
        }
    }

    .login-card {
        background: $color-white;
        border-radius: 20px;
        padding: 32px 24px;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
        border: 1px solid $color-slate-100;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .login-actions {
        display: flex;
        justify-content: center;
    }

    .form-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-label {
        font-size: 14px;
        font-weight: 600;
        color: $color-slate-700;
    }

    .login-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .login-icon {
        opacity: 0.7;
        transition: opacity 200ms ease;
    }

    .btn-primary {
        &:hover .login-icon {
            opacity: 1;
        }
    }

    .login-submit {
        min-width: 220px;
        background: $color-primary;
        box-shadow: 0 12px 24px rgba(124, 58, 237, 0.25);

        &:hover {
            background: #6d28d9;
        }
    }

    .login-error {
        font-size: 13px;
        color: $color-rose-600;
        text-align: center;
    }

    .forgot-link {
        align-self: flex-end;
        border: none;
        background: none;
        padding: 0;
        font-size: 13px;
        color: $color-primary;
        cursor: pointer;
    }

    .modal {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
    }

    .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.4);
    }

    .modal-card {
        position: relative;
        width: min(480px, 92vw);
        background: $color-white;
        border-radius: 20px;
        box-shadow: $shadow-lg;
        border: 1px solid $color-slate-100;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
    }

    .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
    }

    .modal-title {
        font-size: 18px;
        font-weight: 700;
        color: $color-slate-900;
    }

    .modal-subtitle {
        margin-top: 6px;
        font-size: 13px;
        color: $color-slate-500;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    .form-error {
        font-size: 13px;
        color: $color-rose-600;
    }

    .form-success {
        font-size: 13px;
        color: $color-emerald-600;
    }
}
</style>
