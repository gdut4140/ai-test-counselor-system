<script setup lang="ts">
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Search,
    BookOpen
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import type { Component } from 'vue'

const router = useRouter()
const route = useRoute()

type NavigationItem = {
    name: string
    href: string
    icon: Component
}

const navigation: NavigationItem[] = [
    { name: '工作台', href: '/dashboard', icon: LayoutDashboard },
    { name: '活动管理', href: '/activities', icon: Users },
    { name: '学生管理', href: '/students', icon: GraduationCap },
    { name: '课程管理', href: '/courses', icon: BookOpen },
    { name: '消息管理', href: '/messages', icon: MessageSquare },
    { name: '系统管理', href: '/system', icon: Settings },
]

const handleLogout = () => {
    // Clear token logic here
    router.push('/login')
}
</script>

<template>
    <div class="app-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
            <!-- Logo -->
            <div class="sidebar-logo">
                <div class="sidebar-logo-icon">
                    <GraduationCap class="icon icon-sm" />
                </div>
                <span class="sidebar-logo-text">辅导员空间</span>
            </div>

            <!-- Nav -->
            <nav class="sidebar-nav">
                <router-link v-for="item in navigation" :key="item.name" :to="item.href" class="nav-link"
                    :class="route.path.startsWith(item.href) ? 'is-active' : ''">
                    <component :is="item.icon" class="icon nav-icon"
                        :class="route.path.startsWith(item.href) ? 'is-active' : ''" />
                    {{ item.name }}
                </router-link>
            </nav>

            <!-- Bottom Actions -->
            <div class="sidebar-footer">
                <button @click="handleLogout" class="sidebar-logout">
                    <LogOut class="icon" />
                    退出登录
                </button>
            </div>
        </aside>

        <!-- Header -->
        <header class="topbar">
            <!-- Page Title / Breadcrumb (Simplified) -->
            <h1 class="topbar-title">
                {{navigation.find(i => route.path.startsWith(i.href))?.name || 'Dashboard'}}
            </h1>

            <!-- Right Actions -->
            <div class="topbar-actions">
                <div class="topbar-search">
                    <Search class="icon icon-sm topbar-search-icon" />
                    <input type="text" placeholder="全站搜索..." class="input input-search topbar-search-input" />
                </div>

                <button class="btn btn-ghost btn-icon topbar-notification">
                    <Bell class="icon" />
                    <span class="topbar-dot"></span>
                </button>

                <div class="topbar-profile">
                    <div class="topbar-profile-text">
                        <p class="topbar-profile-name">王老师</p>
                        <p class="topbar-profile-role">辅导员</p>
                    </div>
                    <div class="topbar-avatar">
                        王
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-area">
            <div class="main-content">
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
@use '@/assets/tokens' as *;

.app-layout {
    min-height: 100vh;
    background: $color-background;

    .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        width: 256px;
        background: $color-white;
        border-right: 1px solid $color-slate-200;
        z-index: 50;
        display: flex;
        flex-direction: column;

        .sidebar-logo {
            display: flex;
            align-items: center;
            height: 64px;
            padding: 0 24px;
            border-bottom: 1px solid $color-slate-100;
            gap: 12px;

            .sidebar-logo-icon {
                width: 32px;
                height: 32px;
                border-radius: 10px;
                background: $color-primary;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: $color-white;
            }

            .sidebar-logo-text {
                font-size: 18px;
                font-weight: 700;
                color: $color-slate-900;
            }
        }

        .sidebar-nav {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;

            .nav-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                border-radius: 14px;
                font-size: 14px;
                font-weight: 600;
                color: $color-slate-600;
                transition: background 200ms ease, color 200ms ease;

                &:hover {
                    background: $color-slate-100;
                    color: $color-slate-900;
                }

                &.is-active {
                    background: rgba(124, 58, 237, 0.12);
                    color: $color-primary;
                }

                .nav-icon {
                    color: $color-slate-400;
                    transition: color 200ms ease;

                    &.is-active {
                        color: $color-primary;
                    }
                }
            }
        }

        .sidebar-footer {
            padding: 16px;
            border-top: 1px solid $color-slate-100;

            .sidebar-logout {
                width: 100%;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                border-radius: 14px;
                border: none;
                background: transparent;
                color: $color-slate-600;
                font-weight: 600;
                cursor: pointer;
                transition: background 200ms ease, color 200ms ease;

                &:hover {
                    background: #ffe4e6;
                    color: #be123c;
                }
            }
        }
    }

    .topbar {
        position: fixed;
        top: 0;
        left: 256px;
        right: 0;
        height: 64px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid $color-slate-200;
        z-index: 40;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;

        .topbar-title {
            font-size: 20px;
            font-weight: 600;
            color: $color-slate-800;
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 16px;

            .topbar-search {
                position: relative;
                display: none;

                .topbar-search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: $color-slate-400;
                }

                .topbar-search-input {
                    width: 240px;
                    background: $color-slate-100;
                    border: none;
                    border-radius: 999px;
                }
            }

            .topbar-notification {
                position: relative;
            }

            .topbar-dot {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 8px;
                height: 8px;
                background: #f43f5e;
                border-radius: 999px;
                border: 2px solid $color-white;
            }

            .topbar-profile {
                display: flex;
                align-items: center;
                gap: 12px;
                padding-left: 16px;
                border-left: 1px solid $color-slate-200;

                .topbar-profile-text {
                    display: none;
                    text-align: right;
                }

                .topbar-profile-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: $color-slate-900;
                }

                .topbar-profile-role {
                    font-size: 12px;
                    color: $color-slate-500;
                }

                .topbar-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 999px;
                    background: rgba(124, 58, 237, 0.16);
                    color: $color-primary;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    border: 2px solid $color-white;
                    box-shadow: $shadow-sm;
                }
            }
        }
    }

    .main-area {
        margin-left: 256px;
        padding: 96px 32px 32px;
    }

    .main-content {
        max-width: 1200px;
        margin: 0 auto;
    }
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
    .app-layout {
        .topbar-actions {
            .topbar-search {
                display: block;
            }
        }
    }
}

@media (min-width: 640px) {
    .app-layout {
        .topbar-actions {
            .topbar-profile {
                .topbar-profile-text {
                    display: block;
                }
            }
        }
    }
}
</style>
