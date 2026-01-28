<script setup lang="ts">
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
                        <input id="email" name="email" type="text" autocomplete="email" required class="input"
                            placeholder="请输入工号" value="teacher001" />
                    </div>

                    <div class="form-field">
                        <label for="password" class="form-label">密码</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" required
                            class="input" value="password" />
                    </div>

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

    .btn-primary:hover .login-icon {
        opacity: 1;
    }

    .login-submit {
        min-width: 220px;
        background: $color-primary;
        box-shadow: 0 12px 24px rgba(124, 58, 237, 0.25);

        &:hover {
            background: #6d28d9;
        }
    }
}
</style>
