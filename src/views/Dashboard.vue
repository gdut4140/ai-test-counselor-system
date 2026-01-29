<script setup lang="ts">
import {
    Calendar,
    Users,
    CheckCircle
} from 'lucide-vue-next'
import type { Component } from 'vue'

type StatTrend = 'up' | 'neutral'

interface StatCard {
    name: string
    value: string
    change: string
    trend: StatTrend
    icon: Component
    bg: string
}

const stats: StatCard[] = [
    { name: '今日活动', value: '3', change: '0', trend: 'neutral', icon: Calendar, bg: 'icon-primary' },
    { name: '学生总数', value: '248', change: '+15', trend: 'up', icon: Users, bg: 'icon-emerald' },
    { name: '本周签到率', value: '98%', change: '+1.2%', trend: 'up', icon: CheckCircle, bg: 'icon-amber' },
]
</script>

<template>
    <div class="dashboard page">
        <!-- Welcome Header -->
        <div class="dashboard-header">
            <div>
                <h2 class="dashboard-title">工作台</h2>
                <p class="dashboard-subtitle">欢迎回来，王老师。这里是今日的工作概览。</p>
            </div>
            <div class="dashboard-actions">
                <button class="btn btn-outline">
                    下载报表
                </button>
                <button class="btn btn-primary">
                    新建通知
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div v-for="stat in stats" :key="stat.name" class="stat-card card card-hover">
                <div class="stat-top">
                    <div class="stat-icon" :class="stat.bg">
                        <component :is="stat.icon" class="icon" />
                    </div>
                    <span class="stat-trend" :class="stat.trend === 'up' ? 'trend-up' : ''">
                        {{ stat.change }}
                    </span>
                </div>
                <div class="stat-body">
                    <h3 class="stat-value">{{ stat.value }}</h3>
                    <p class="stat-label">{{ stat.name }}</p>
                </div>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="dashboard-grid">
            <div class="panel card">
                <h3 class="panel-title spaced">今日日程</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot dot-primary"></div>
                    </div>
                    <div class="timeline-content">
                        <p class="timeline-title">部门晨会</p>
                        <p class="timeline-time">9:00 - 10:00</p>
                        <p class="timeline-meta">行政楼 302 会议室</p>
                    </div>
                </div>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot dot-success"></div>
                    </div>
                    <div class="timeline-content">
                        <p class="timeline-title">张三 - 课程辅导</p>
                        <p class="timeline-time">10:00 - 11:00</p>
                        <p class="timeline-meta">辅导员办公室</p>
                    </div>
                </div>

                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot dot-muted"></div>
                    </div>
                    <div class="timeline-content">
                        <p class="timeline-title">下午茶/休息</p>
                        <p class="timeline-time">15:00 - 15:30</p>
                    </div>
                </div>

                <div class="panel-footer">
                    <button class="btn btn-outline btn-wide">
                        + 添加日程
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens' as *;

.dashboard {
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .dashboard-title {
            font-size: 24px;
            font-weight: 700;
        }

        .dashboard-subtitle {
            margin-top: 4px;
            color: $color-slate-500;
            font-size: 14px;
        }

        .dashboard-actions {
            display: flex;
            gap: 12px;
        }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;

        .stat-card {
            padding: 24px;

            .stat-top {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.icon-primary {
                        background: rgba(124, 58, 237, 0.12);
                        color: $color-primary;
                    }

                    &.icon-emerald {
                        background: #dcfce7;
                        color: #16a34a;
                    }

                    &.icon-amber {
                        background: #fef3c7;
                        color: #d97706;
                    }
                }

                .stat-trend {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 999px;
                    background: $color-slate-100;
                    color: $color-slate-600;

                    &.trend-up {
                        background: #dcfce7;
                        color: #166534;
                    }
                }
            }

            .stat-body {
                margin-top: 16px;

                .stat-value {
                    font-size: 30px;
                    font-weight: 700;
                }

                .stat-label {
                    margin-top: 6px;
                    color: $color-slate-500;
                    font-size: 13px;
                }
            }
        }
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;

        .panel {
            overflow: hidden;
            padding: 20px;

            .panel-title {
                font-size: 16px;
                font-weight: 700;

                &.spaced {
                    margin-bottom: 20px;
                }
            }

            .timeline {
                display: grid;
                grid-template-columns: 32px 1fr;
                gap: 12px;
                padding: 12px 0;
                position: relative;

                &::before {
                    content: '';
                    position: absolute;
                    left: 14px;
                    top: 16px;
                    bottom: 16px;
                    width: 2px;
                    background: $color-slate-100;
                }

                .timeline-item {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    z-index: 1;

                    .timeline-dot {
                        width: 12px;
                        height: 12px;
                        border-radius: 999px;
                        margin-top: 4px;
                        background: $color-slate-300;

                        &.dot-primary {
                            background: $color-primary;
                            box-shadow: 0 0 0 6px rgba(124, 58, 237, 0.2);
                        }

                        &.dot-success {
                            background: #22c55e;
                            box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.2);
                        }

                        &.dot-muted {
                            background: $color-slate-300;
                        }
                    }
                }

                .timeline-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;

                    .timeline-title {
                        font-size: 13px;
                        font-weight: 600;
                        color: $color-slate-900;
                    }

                    .timeline-time {
                        font-size: 12px;
                        color: $color-slate-500;
                    }

                    .timeline-meta {
                        font-size: 12px;
                        color: $color-slate-400;
                    }
                }
            }

            .panel-footer {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid $color-slate-100;
            }
        }
    }
}
</style>
