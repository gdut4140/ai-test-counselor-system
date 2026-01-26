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
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-slate-900">系统管理</h2>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Settings Sidebar -->
            <div class="lg:col-span-1">
                <nav class="space-y-1">
                    <button v-for="tab in tabsData" :key="tab.id" @click="setActiveSection(tab.id)"
                        class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors"
                        :class="activeSection === tab.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'">
                        <component :is="tab.icon" class="w-5 h-5 mr-3"
                            :class="activeSection === tab.id ? 'text-primary-600' : 'text-slate-400'" />
                        {{ tab.name }}
                    </button>
                </nav>
            </div>

            <!-- Content Area -->
            <div class="lg:col-span-3">
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <!-- Profile Section -->
                    <div v-if="activeSection === 'profile'" class="space-y-6">
                        <div class="flex items-center gap-6">
                            <div class="relative">
                                <div
                                    class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl text-slate-400 font-bold border-4 border-white shadow-sm overflow-hidden">
                                    <img v-if="user?.avatar" :src="user.avatar" alt="Avatar"
                                        class="w-full h-full object-cover">
                                    <span v-else>{{ user?.name?.charAt(0) }}</span>
                                </div>
                                <button
                                    class="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 text-slate-600">
                                    <User class="w-4 h-4" />
                                </button>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">{{ user?.name }}</h3>
                                <p class="text-sm text-slate-500">{{ user?.roleName }} · {{ user?.college }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                                <input type="text" v-model="formName"
                                    class="w-full rounded-lg border-slate-200 focus:border-primary-500 focus:ring-primary-500 text-sm py-2.5" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">工号</label>
                                <input type="text" :value="user?.id" disabled
                                    class="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-500 text-sm py-2.5 cursor-not-allowed" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                                <input type="text" v-model="formPhone"
                                    class="w-full rounded-lg border-slate-200 focus:border-primary-500 focus:ring-primary-500 text-sm py-2.5" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">电子邮箱</label>
                                <input type="email" v-model="formEmail"
                                    class="w-full rounded-lg border-slate-200 focus:border-primary-500 focus:ring-primary-500 text-sm py-2.5" />
                            </div>
                        </div>
                    </div>

                    <!-- Notifications Section -->
                    <div v-if="activeSection === 'notifications'" class="space-y-6">
                        <div class="border-b border-slate-100 pb-4 mb-4">
                            <h3 class="text-lg font-bold text-slate-900">通知偏好设置</h3>
                            <p class="text-sm text-slate-500">控制您接收系统消息的方式。</p>
                        </div>
                        <div class="space-y-4">
                            <div v-for="setting in notificationSettings" :key="setting.id"
                                class="flex items-center justify-between py-3">
                                <div>
                                    <p class="font-medium text-slate-900">{{ setting.label }}</p>
                                </div>
                                <div class="flex items-center gap-4">
                                    <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input type="checkbox" v-model="setting.email"
                                            class="rounded border-slate-300 text-primary-600 focus:ring-primary-500">
                                        邮件
                                    </label>
                                    <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input type="checkbox" v-model="setting.push"
                                            class="rounded border-slate-300 text-primary-600 focus:ring-primary-500">
                                        站内信
                                    </label>
                                    <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input type="checkbox" v-model="setting.sms"
                                            class="rounded border-slate-300 text-primary-600 focus:ring-primary-500">
                                        短信
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Security Section Placeholder -->
                    <div v-if="activeSection === 'security'" class="space-y-6 py-12 text-center text-slate-500">
                        <Lock class="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>密码修改与安全日志功能待集成</p>
                    </div>

                    <!-- Roles Section Placeholder -->
                    <div v-if="activeSection === 'roles'" class="space-y-6 py-12 text-center text-slate-500">
                        <Shield class="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>角色权限管理功能待集成</p>
                    </div>

                    <!-- Common Footer Actions -->
                    <div class="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                        <button
                            class="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20 flex items-center">
                            <Save class="w-4 h-4 mr-2" />
                            保存更改
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
