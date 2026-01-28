<script setup>
import {
    LayoutDashboard,
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
    <div class="layout">
        <!-- Sidebar -->
        <aside class="layout__sidebar">
            <!-- Logo -->
            <div class="layout__logo">
                <div class="layout__logo-icon">
                    <GraduationCap class="icon icon--sm" />
                </div>
                <span class="layout__logo-text">辅导员空间</span>
            </div>

            <!-- Nav -->
            <nav class="layout__nav">
                <router-link v-for="item in navigation" :key="item.name" :to="item.href" class="layout__nav-link"
                    :class="route.path.startsWith(item.href) ? 'layout__nav-link--active' : ''">
                    <component :is="item.icon" class="icon layout__nav-icon"
                        :class="route.path.startsWith(item.href) ? 'layout__nav-icon--active' : ''" />
                    {{ item.name }}
                </router-link>
            </nav>

            <!-- Bottom Actions -->
            <div class="layout__sidebar-footer">
                <button @click="handleLogout" class="layout__logout">
                    <LogOut class="icon" />
                    退出登录
                </button>
            </div>
        </aside>

        <!-- Header -->
        <header class="layout__header">
            <!-- Page Title / Breadcrumb (Simplified) -->
            <h1 class="layout__title">
                {{navigation.find(i => route.path.startsWith(i.href))?.name || 'Dashboard'}}
            </h1>

            <!-- Right Actions -->
            <div class="layout__actions">
                <div class="layout__search">
                    <Search class="icon icon--sm layout__search-icon" />
                    <input type="text" placeholder="全站搜索..." class="input input--search layout__search-input" />
                </div>

                <button class="btn btn--ghost btn--icon layout__notification">
                    <Bell class="icon" />
                    <span class="layout__notification-dot"></span>
                </button>

                <div class="layout__profile">
                    <div class="layout__profile-text">
                        <p class="layout__profile-name">王老师</p>
                        <p class="layout__profile-role">辅导员</p>
                    </div>
                    <div class="layout__avatar">
                        王
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="layout__main">
            <div class="layout__content">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
.layout {
    min-height: 100vh;
    background: var(--color-background);
}

.layout__sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 256px;
    background: var(--color-white);
    border-right: 1px solid var(--color-slate-200);
    z-index: 50;
    display: flex;
    flex-direction: column;
}

.layout__logo {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 24px;
    border-bottom: 1px solid var(--color-slate-100);
    gap: 12px;
}

.layout__logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: var(--color-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
}

.layout__logo-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-slate-900);
}

.layout__nav {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.layout__nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-slate-600);
    transition: background 200ms ease, color 200ms ease;
}

.layout__nav-link:hover {
    background: var(--color-slate-100);
    color: var(--color-slate-900);
}

.layout__nav-link--active {
    background: rgba(124, 58, 237, 0.12);
    color: var(--color-primary);
}

.layout__nav-icon {
    color: var(--color-slate-400);
    transition: color 200ms ease;
}

.layout__nav-icon--active {
    color: var(--color-primary);
}

.layout__sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--color-slate-100);
}

.layout__logout {
    width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 14px;
    border: none;
    background: transparent;
    color: var(--color-slate-600);
    font-weight: 600;
    cursor: pointer;
    transition: background 200ms ease, color 200ms ease;
}

.layout__logout:hover {
    background: #ffe4e6;
    color: #be123c;
}

.layout__header {
    position: fixed;
    top: 0;
    left: 256px;
    right: 0;
    height: 64px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-slate-200);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
}

.layout__title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-slate-800);
}

.layout__actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.layout__search {
    position: relative;
    display: none;
}

.layout__search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-slate-400);
}

.layout__search-input {
    width: 240px;
    background: var(--color-slate-100);
    border: none;
    border-radius: 999px;
}

.layout__notification {
    position: relative;
}

.layout__notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    background: #f43f5e;
    border-radius: 999px;
    border: 2px solid var(--color-white);
}

.layout__profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 16px;
    border-left: 1px solid var(--color-slate-200);
}

.layout__profile-text {
    display: none;
    text-align: right;
}

.layout__profile-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-slate-900);
}

.layout__profile-role {
    font-size: 12px;
    color: var(--color-slate-500);
}

.layout__avatar {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    background: rgba(124, 58, 237, 0.16);
    color: var(--color-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border: 2px solid var(--color-white);
    box-shadow: var(--shadow-sm);
}

.layout__main {
    margin-left: 256px;
    padding: 96px 32px 32px;
}

.layout__content {
    max-width: 1200px;
    margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (min-width: 768px) {
    .layout__search {
        display: block;
    }
}

@media (min-width: 640px) {
    .layout__profile-text {
        display: block;
    }
}
</style>
