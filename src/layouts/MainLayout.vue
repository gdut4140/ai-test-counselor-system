<script setup>
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    GraduationCap,
    Settings,
    LogOut,
    Bell,
    Search,
    BookOpen
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navigation = [
    { name: '工作台', href: '/dashboard', icon: LayoutDashboard },
    { name: '预约管理', href: '/appointments', icon: CalendarDays },
    { name: '活动管理', href: '/activities', icon: Users },
    { name: '学生管理', href: '/students', icon: GraduationCap },
    { name: '课程管理', href: '/courses', icon: BookOpen },
    { name: '系统管理', href: '/system', icon: Settings },
]

const handleLogout = () => {
    // Clear token logic here
    router.push('/login')
}
</script>

<template>
    <div class="min-h-screen bg-slate-50">
        <!-- Sidebar -->
        <aside
            class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out">
            <!-- Logo -->
            <div class="flex items-center h-16 px-6 border-b border-slate-100">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                    <GraduationCap class="w-5 h-5 text-white" />
                </div>
                <span class="text-lg font-bold text-slate-900 tracking-tight">辅导员空间</span>
            </div>

            <!-- Nav -->
            <nav class="p-4 space-y-1">
                <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                    class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
                    :class="[
                        route.path.startsWith(item.href)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    ]">
                    <component :is="item.icon" class="w-5 h-5 mr-3 transition-colors"
                        :class="route.path.startsWith(item.href) ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'" />
                    {{ item.name }}
                </router-link>
            </nav>

            <!-- Bottom Actions -->
            <div class="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
                <button @click="handleLogout"
                    class="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-700 transition-colors">
                    <LogOut class="w-5 h-5 mr-3" />
                    退出登录
                </button>
            </div>
        </aside>

        <!-- Header -->
        <header
            class="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-8">
            <!-- Page Title / Breadcrumb (Simplified) -->
            <h1 class="text-xl font-semibold text-slate-800">
                {{navigation.find(i => route.path.startsWith(i.href))?.name || 'Dashboard'}}
            </h1>

            <!-- Right Actions -->
            <div class="flex items-center gap-4">
                <div class="relative hidden md:block">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="全站搜索..."
                        class="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 w-64 transition-all" />
                </div>

                <button class="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell class="w-5 h-5" />
                    <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-medium text-slate-900">王老师</p>
                        <p class="text-xs text-slate-500">辅导员</p>
                    </div>
                    <div
                        class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
                        王
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="ml-64 pt-20 p-8">
            <div class="max-w-7xl mx-auto">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </main>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
