<script setup>
import {
    Calendar,
    Users,
    CheckCircle
} from 'lucide-vue-next'

const stats = [
    { name: '今日活动', value: '3', change: '0', trend: 'neutral', icon: Calendar, bg: 'stat-card__icon--primary' },
    { name: '学生总数', value: '248', change: '+15', trend: 'up', icon: Users, bg: 'stat-card__icon--emerald' },
    { name: '本周签到率', value: '98%', change: '+1.2%', trend: 'up', icon: CheckCircle, bg: 'stat-card__icon--amber' },
]
</script>

<template>
    <div class="dashboard page">
        <!-- Welcome Header -->
        <div class="dashboard__header">
            <div>
                <h2 class="dashboard__title">工作台</h2>
                <p class="dashboard__subtitle">欢迎回来，王老师。这里是今日的工作概览。</p>
            </div>
            <div class="dashboard__actions">
                <button class="btn btn--outline">
                    下载报表
                </button>
                <button class="btn btn--primary">
                    新建通知
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div v-for="stat in stats" :key="stat.name" class="stat-card card card--hover">
                <div class="stat-card__top">
                    <div class="stat-card__icon" :class="stat.bg">
                        <component :is="stat.icon" class="icon" />
                    </div>
                    <span class="stat-card__trend" :class="stat.trend === 'up' ? 'stat-card__trend--up' : ''">
                        {{ stat.change }}
                    </span>
                </div>
                <div class="stat-card__body">
                    <h3 class="stat-card__value">{{ stat.value }}</h3>
                    <p class="stat-card__label">{{ stat.name }}</p>
                </div>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="dashboard__grid">
            <div class="dashboard__panel card">
                <h3 class="dashboard__panel-title dashboard__panel-title--spaced">今日日程</h3>
                <div class="timeline">
                    <div class="timeline__item">
                        <div class="timeline__dot timeline__dot--primary"></div>
                    </div>
                    <div class="timeline__content">
                        <p class="timeline__title">部门晨会</p>
                        <p class="timeline__time">9:00 - 10:00</p>
                        <p class="timeline__meta">行政楼 302 会议室</p>
                    </div>
                </div>
                <div class="timeline">
                    <div class="timeline__item">
                        <div class="timeline__dot timeline__dot--success"></div>
                    </div>
                    <div class="timeline__content">
                        <p class="timeline__title">张三 - 课程辅导</p>
                        <p class="timeline__time">10:00 - 11:00</p>
                        <p class="timeline__meta">辅导员办公室</p>
                    </div>
                </div>

                <div class="timeline">
                    <div class="timeline__item">
                        <div class="timeline__dot timeline__dot--muted"></div>
                    </div>
                    <div class="timeline__content">
                        <p class="timeline__title">下午茶/休息</p>
                        <p class="timeline__time">15:00 - 15:30</p>
                    </div>
                </div>

                <div class="dashboard__panel-footer">
                    <button class="btn btn--outline btn--wide">
                        + 添加日程
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dashboard__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.dashboard__title {
    font-size: 24px;
    font-weight: 700;
}

.dashboard__subtitle {
    margin-top: 4px;
    color: var(--color-slate-500);
    font-size: 14px;
}

.dashboard__actions {
    display: flex;
    gap: 12px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.stat-card {
    padding: 24px;
}

.stat-card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stat-card__icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}


.stat-card__icon--primary {
    background: rgba(124, 58, 237, 0.12);
    color: var(--color-primary);
}

.stat-card__icon--emerald {
    background: #dcfce7;
    color: #16a34a;
}

.stat-card__icon--amber {
    background: #fef3c7;
    color: #d97706;
}

.stat-card__trend {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--color-slate-100);
    color: var(--color-slate-600);
}

.stat-card__trend--up {
    background: #dcfce7;
    color: #166534;
}

.stat-card__body {
    margin-top: 16px;
}

.stat-card__value {
    font-size: 30px;
    font-weight: 700;
}

.stat-card__label {
    margin-top: 6px;
    color: var(--color-slate-500);
    font-size: 13px;
}

.dashboard__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

.dashboard__panel {
    overflow: hidden;
}

.dashboard__panel-title {
    font-size: 16px;
    font-weight: 700;
}

.dashboard__panel-title--spaced {
    margin-bottom: 20px;
}


.timeline {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 12px;
    padding: 12px 0;
    position: relative;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 14px;
    top: 16px;
    bottom: 16px;
    width: 2px;
    background: var(--color-slate-100);
}

.timeline__item {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 1;
}

.timeline__dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    margin-top: 4px;
    background: var(--color-slate-300);
}

.timeline__dot--primary {
    background: var(--color-primary);
    box-shadow: 0 0 0 6px rgba(124, 58, 237, 0.2);
}

.timeline__dot--success {
    background: #22c55e;
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.2);
}

.timeline__dot--muted {
    background: var(--color-slate-300);
}

.timeline__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.timeline__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-slate-900);
}

.timeline__time {
    font-size: 12px;
    color: var(--color-slate-500);
}

.timeline__meta {
    font-size: 12px;
    color: var(--color-slate-400);
}

.dashboard__panel-footer {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--color-slate-100);
}

.btn--wide {
    width: 100%;
}
</style>
