<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { storeToRefs } from 'pinia'
import { useTabs } from '../../composables/useTabs'
import {
    User,
    Lock,
    Shield,
    Save
} from 'lucide-vue-next'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Sidebar tabs configuration
const tabsData = [
    { id: 'profile', name: '个人资料', icon: User },
    { id: 'security', name: '账号安全', icon: Lock },
    { id: 'roles', name: '角色权限', icon: Shield },
]

const { activeTabId: activeSection, setTab: setActiveSection } = useTabs(tabsData, 'profile')

const formName = ref(user.value?.name || '')
const formPhone = ref('13800138000') // Mock data or add to store
const formEmail = ref('wang@edu.cn') // Mock data or add to store

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isUpdating = ref(false)

const handlePasswordUpdate = async () => {
    passwordError.value = ''
    passwordSuccess.value = ''

    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        passwordError.value = '请完整填写旧密码与新密码。'
        return
    }
    if (newPassword.value !== confirmPassword.value) {
        passwordError.value = '两次输入的新密码不一致。'
        return
    }
    if (newPassword.value === oldPassword.value) {
        passwordError.value = '新密码不能与旧密码相同。'
        return
    }

    isUpdating.value = true
    try {
        await authStore.updatePassword(oldPassword.value, newPassword.value)
        passwordSuccess.value = '密码修改成功，请使用新密码登录。'
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (error) {
        passwordError.value = error instanceof Error ? error.message : '密码修改失败'
    } finally {
        isUpdating.value = false
    }
}


// const notificationSettings = ref([...]) <-- Removed local definition
</script>

<template>
    <div class="page settings-page">
        <h2 class="settings-title">系统管理</h2>

        <div class="settings-layout">
            <!-- Settings Sidebar -->
            <div class="settings-sidebar">
                <nav class="settings-nav">
                    <button v-for="tab in tabsData" :key="tab.id" @click="setActiveSection(tab.id)" class="nav-item"
                        :class="activeSection === tab.id ? 'is-active' : ''">
                        <component :is="tab.icon" class="icon nav-icon" />
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <!-- Content Area -->
            <div class="settings-content">
                <div class="card settings-card">
                    <!-- Profile Section -->
                    <div v-if="activeSection === 'profile'" class="settings-section">
                        <div class="profile-block">
                            <div class="relative">
                                <div class="profile-avatar">
                                    <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" class="avatar-image">
                                    <span v-else>{{ user?.name?.charAt(0) }}</span>
                                </div>
                                <button class="avatar-edit">
                                    <User class="icon icon-xs" />
                                </button>
                            </div>
                            <div>
                                <h3 class="profile-name">{{ user?.name }}</h3>
                                <p class="profile-meta">{{ user?.roleName }} · {{ user?.college }}</p>
                            </div>
                        </div>

                        <div class="settings-form">
                            <div class="form-field">
                                <label class="form-label">姓名</label>
                                <input type="text" v-model="formName" class="input" />
                            </div>
                            <div class="form-field">
                                <label class="form-label">工号</label>
                                <input type="text" :value="user?.id" disabled class="input input-disabled" />
                            </div>
                            <div class="form-field">
                                <label class="form-label">联系电话</label>
                                <input type="text" v-model="formPhone" class="input" />
                            </div>
                            <div class="form-field">
                                <label class="form-label">电子邮箱</label>
                                <input type="email" v-model="formEmail" class="input" />
                            </div>
                        </div>
                    </div>

                    <!-- Security Section -->
                    <div v-if="activeSection === 'security'" class="settings-section">
                        <div class="section-header">
                            <h3 class="section-title">修改密码</h3>
                            <p class="section-subtitle">首次登录后请修改初始密码以提升账户安全。</p>
                        </div>

                        <div class="settings-form security-form">
                            <div class="form-field">
                                <label class="form-label">旧密码</label>
                                <input v-model="oldPassword" type="password" class="input" placeholder="输入旧密码" />
                            </div>
                            <div class="form-field">
                                <label class="form-label">新密码</label>
                                <input v-model="newPassword" type="password" class="input" placeholder="输入新密码" />
                            </div>
                            <div class="form-field">
                                <label class="form-label">确认新密码</label>
                                <input v-model="confirmPassword" type="password" class="input" placeholder="再次输入新密码" />
                            </div>
                        </div>

                        <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
                        <p v-if="passwordSuccess" class="form-success">{{ passwordSuccess }}</p>

                        <div class="settings-footer">
                            <button class="btn btn-primary" :disabled="isUpdating" @click="handlePasswordUpdate">
                                <Save class="icon icon-sm" />
                                保存新密码
                            </button>
                        </div>
                    </div>

                    <!-- Roles Section Placeholder -->
                    <div v-if="activeSection === 'roles'" class="empty-state">
                        <Shield class="empty-icon" />
                        <p>角色权限管理功能待集成</p>
                    </div>

                    <div v-if="activeSection === 'profile'" class="settings-footer">
                        <button class="btn btn-primary">
                            <Save class="icon icon-sm" />
                            保存资料
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens' as *;

.settings-page {
    .settings-title {
        font-size: 24px;
        font-weight: 700;
    }

    .settings-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;

        .settings-sidebar {
            background: transparent;

            .settings-nav {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 14px;
                    border: none;
                    background: transparent;
                    color: $color-slate-600;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 200ms ease, color 200ms ease;

                    &:hover {
                        background: $color-slate-100;
                    }

                    &.is-active {
                        background: rgba(124, 58, 237, 0.12);
                        color: $color-primary;

                        .nav-icon {
                            color: $color-primary;
                        }
                    }

                    .nav-icon {
                        color: $color-slate-400;
                    }
                }
            }
        }

        .settings-content {
            .settings-card {
                padding: 24px;

                .settings-section {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;

                    .profile-block {
                        display: flex;
                        align-items: center;
                        gap: 24px;
                        flex-wrap: wrap;

                        .profile-avatar {
                            width: 96px;
                            height: 96px;
                            border-radius: 999px;
                            background: $color-slate-100;
                            color: $color-slate-400;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 32px;
                            font-weight: 700;
                            border: 4px solid $color-white;
                            box-shadow: $shadow-sm;
                            overflow: hidden;
                            position: relative;

                            .avatar-image {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        .avatar-edit {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            background: $color-white;
                            border: 1px solid $color-slate-200;
                            border-radius: 999px;
                            padding: 6px;
                            cursor: pointer;
                            box-shadow: $shadow-sm;

                            &:hover {
                                background: $color-slate-100;
                            }
                        }

                        .profile-name {
                            font-size: 18px;
                            font-weight: 700;
                            color: $color-slate-900;
                            margin: 0 0 4px 0;
                        }

                        .profile-meta {
                            font-size: 13px;
                            color: $color-slate-500;
                        }
                    }
                }

                .settings-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;

                    &.security-form {
                        grid-template-columns: 1fr;
                    }

                    .form-field {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;

                        .form-label {
                            font-size: 13px;
                            font-weight: 600;
                            color: $color-slate-700;
                        }

                        .input-disabled {
                            background: $color-slate-100;
                            color: $color-slate-500;
                            cursor: not-allowed;
                        }
                    }
                }

                .section-header {
                    padding-bottom: 16px;
                    border-bottom: 1px solid $color-slate-100;

                    .section-title {
                        font-size: 18px;
                        font-weight: 700;
                        color: $color-slate-900;
                    }

                    .section-subtitle {
                        font-size: 13px;
                        color: $color-slate-500;
                    }
                }

                .form-error {
                    color: $color-rose-600;
                    font-size: 13px;
                }

                .form-success {
                    color: $color-emerald-600;
                    font-size: 13px;
                }

                .empty-state {
                    padding: 48px 0;
                    text-align: center;
                    color: $color-slate-500;

                    .empty-icon {
                        width: 48px;
                        height: 48px;
                        margin: 0 auto 12px;
                        color: $color-slate-300;
                    }
                }

                .settings-footer {
                    padding-top: 24px;
                    margin-top: 24px;
                    border-top: 1px solid $color-slate-100;
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }
}

@media (min-width: 768px) {
    .settings-page {
        .settings-form {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media (min-width: 1024px) {
    .settings-page {
        .settings-layout {
            grid-template-columns: 240px 1fr;
        }
    }
}
</style>
