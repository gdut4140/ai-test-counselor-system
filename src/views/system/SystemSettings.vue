<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useSettingsStore } from '../../stores/settings'
import { storeToRefs } from 'pinia'
import { useTabs } from '../../composables/useTabs'
import {
    User,
    Bell,
    Lock,
    Shield,
    Save
} from 'lucide-vue-next'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const settingsStore = useSettingsStore()
const { notificationSettings } = storeToRefs(settingsStore)

// Sidebar tabs configuration
const tabsData = [
    { id: 'profile', name: '个人资料', icon: User },
    { id: 'notifications', name: '通知设置', icon: Bell },
    { id: 'security', name: '账号安全', icon: Lock },
    { id: 'roles', name: '角色权限', icon: Shield },
]

const { activeTabId: activeSection, setTab: setActiveSection, currentTab } = useTabs(tabsData, 'profile')

const formName = ref(user.value?.name || '')
const formPhone = ref('13800138000') // Mock data or add to store
const formEmail = ref('wang@edu.cn') // Mock data or add to store


// const notificationSettings = ref([...]) <-- Removed local definition
</script>

<template>
    <div class="page settings-page">
        <h2 class="settings-page__title">系统管理</h2>

        <div class="settings-layout">
            <!-- Settings Sidebar -->
            <div class="settings-sidebar">
                <nav class="settings-nav">
                    <button v-for="tab in tabsData" :key="tab.id" @click="setActiveSection(tab.id)"
                        class="settings-nav__item"
                        :class="activeSection === tab.id ? 'settings-nav__item--active' : ''">
                        <component :is="tab.icon" class="icon settings-nav__icon" />
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <!-- Content Area -->
            <div class="settings-content">
                <div class="card settings-card">
                    <!-- Profile Section -->
                    <div v-if="activeSection === 'profile'" class="settings-section">
                        <div class="settings-profile">
                            <div class="relative">
                                <div class="settings-avatar">
                                    <img v-if="user?.avatar" :src="user.avatar" alt="Avatar"
                                        class="settings-avatar__image">
                                    <span v-else>{{ user?.name?.charAt(0) }}</span>
                                </div>
                                <button class="settings-avatar__edit">
                                    <User class="icon icon--xs" />
                                </button>
                            </div>
                            <div>
                                <h3 class="settings-profile__name">{{ user?.name }}</h3>
                                <p class="settings-profile__meta">{{ user?.roleName }} · {{ user?.college }}</p>
                            </div>
                        </div>

                        <div class="settings-form">
                            <div class="form-field">
                                <label class="form-label">姓名</label>
                                <input type="text" v-model="formName" class="input" />
                            </div>
                            <div class="form-field">
                                <label class="form-label">工号</label>
                                <input type="text" :value="user?.id" disabled class="input input--disabled" />
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

                    <!-- Notifications Section -->
                    <div v-if="activeSection === 'notifications'" class="settings-section">
                        <div class="settings-section__header">
                            <h3 class="settings-section__title">通知偏好设置</h3>
                            <p class="settings-section__subtitle">控制您接收系统消息的方式。</p>
                        </div>
                        <div class="settings-section__list">
                            <div v-for="setting in notificationSettings" :key="setting.id" class="settings-option">
                                <div>
                                    <p class="settings-option__label">{{ setting.label }}</p>
                                </div>
                                <div class="settings-option__controls">
                                    <label class="checkbox">
                                        <input type="checkbox" v-model="setting.email">
                                        邮件
                                    </label>
                                    <label class="checkbox">
                                        <input type="checkbox" v-model="setting.push">
                                        站内信
                                    </label>
                                    <label class="checkbox">
                                        <input type="checkbox" v-model="setting.sms">
                                        短信
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Security Section Placeholder -->
                    <div v-if="activeSection === 'security'" class="settings-empty">
                        <Lock class="settings-empty__icon" />
                        <p>密码修改与安全日志功能待集成</p>
                    </div>

                    <!-- Roles Section Placeholder -->
                    <div v-if="activeSection === 'roles'" class="settings-empty">
                        <Shield class="settings-empty__icon" />
                        <p>角色权限管理功能待集成</p>
                    </div>

                    <!-- Common Footer Actions -->
                    <div class="settings-footer">
                        <button class="btn btn--primary">
                            <Save class="icon icon--sm" />
                            保存更改
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.settings-page__title {
    font-size: 24px;
    font-weight: 700;
}

.settings-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

.settings-sidebar {
    background: transparent;
}

.settings-nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.settings-nav__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 14px;
    border: none;
    background: transparent;
    color: var(--color-slate-600);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 200ms ease, color 200ms ease;
}

.settings-nav__item:hover {
    background: var(--color-slate-100);
}

.settings-nav__item--active {
    background: rgba(124, 58, 237, 0.12);
    color: var(--color-primary);
}

.settings-nav__icon {
    color: var(--color-slate-400);
}

.settings-nav__item--active .settings-nav__icon {
    color: var(--color-primary);
}

.settings-card {
    padding: 24px;
}

.settings-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.settings-profile {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
}

.settings-avatar {
    width: 96px;
    height: 96px;
    border-radius: 999px;
    background: var(--color-slate-100);
    color: var(--color-slate-400);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    border: 4px solid var(--color-white);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    position: relative;
}

.settings-avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.settings-avatar__edit {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--color-white);
    border: 1px solid var(--color-slate-200);
    border-radius: 999px;
    padding: 6px;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
}

.settings-avatar__edit:hover {
    background: var(--color-slate-100);
}

.settings-profile__name {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-slate-900);
    margin: 0 0 4px 0;
}

.settings-profile__meta {
    font-size: 13px;
    color: var(--color-slate-500);
}

.settings-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-slate-700);
}

.input--disabled {
    background: var(--color-slate-100);
    color: var(--color-slate-500);
    cursor: not-allowed;
}

.settings-section__header {
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-slate-100);
}

.settings-section__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-slate-900);
}

.settings-section__subtitle {
    font-size: 13px;
    color: var(--color-slate-500);
}

.settings-section__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.settings-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
}

.settings-option__label {
    font-weight: 600;
    color: var(--color-slate-900);
}

.settings-option__controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.checkbox {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-slate-600);
    cursor: pointer;
}

.checkbox input {
    accent-color: var(--color-primary);
    width: 16px;
    height: 16px;
}

.settings-empty {
    padding: 48px 0;
    text-align: center;
    color: var(--color-slate-500);
}

.settings-empty__icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    color: var(--color-slate-300);
}

.settings-footer {
    padding-top: 24px;
    margin-top: 24px;
    border-top: 1px solid var(--color-slate-100);
    display: flex;
    justify-content: flex-end;
}

@media (min-width: 768px) {
    .settings-form {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .settings-layout {
        grid-template-columns: 240px 1fr;
    }
}
</style>
