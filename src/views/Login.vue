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
    <div class="login">
        <div class="login__container">
            <div class="login__brand">
                <div class="login__logo">
                    <GraduationCap class="icon" />
                </div>
                <h2 class="login__title">辅导员管理系统</h2>
                <p class="login__subtitle">高效 · 简约 · 智能</p>
            </div>

            <div class="login__card">
                <form class="login__form" @submit.prevent="handleLogin">
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

                    <div>
                        <button type="submit" class="btn btn--primary btn--wide" :disabled="isLoading">
                            <span v-if="!isLoading" class="login__button-content">
                                登录系统
                                <ArrowRight class="icon icon--sm login__button-icon" />
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
.login {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    background: var(--color-background);
}

.login__container {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.login__brand {
    text-align: center;
}

.login__logo {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    border-radius: 18px;
    background: var(--color-primary);
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 24px rgba(124, 58, 237, 0.25);
    transform: rotate(-6deg);
}

.login__title {
    margin-top: 20px;
    font-size: 28px;
    font-weight: 700;
}

.login__subtitle {
    margin-top: 8px;
    font-size: 14px;
    color: var(--color-slate-600);
}

.login__card {
    background: var(--color-white);
    border-radius: 20px;
    padding: 32px 24px;
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
    border: 1px solid var(--color-slate-100);
}

.login__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-slate-700);
}

.login__button-content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.login__button-icon {
    opacity: 0.7;
    transition: opacity 200ms ease;
}

.btn--primary:hover .login__button-icon {
    opacity: 1;
}
</style>
