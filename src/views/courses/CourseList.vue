<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '../../stores/courses'
import PageHeader from '../../components/PageHeader.vue'
import StatusBadge from '../../components/StatusBadge.vue'
import {
    Search,
    BookOpen,
    MapPin,
    Clock,
    MoreHorizontal,
    CalendarCheck,
    BellRing
} from 'lucide-vue-next'

const courseStore = useCourseStore()
const { courses } = storeToRefs(courseStore)
const handleUrge = (courseName) => {
    alert(`已向《${courseName}》缺课学生发送催促提醒！`)
    // 实际开发中，这里会调用后端 API 发送通知
}
</script>

<template>
    <div class="page course-page">
        <!-- Page Header -->
        <PageHeader title="课程管理">
            <template #actions>
                <button class="btn btn--outline">
                    <CalendarCheck class="icon icon--sm" />
                    考勤统计
                </button>
            </template>
        </PageHeader>

        <!-- Stats Overview -->
        <div class="summary-grid">
            <div class="summary-card card">
                <div class="summary-card__icon summary-card__icon--indigo">
                    <BookOpen class="icon" />
                </div>
                <div>
                    <p class="summary-card__label">本学期课程</p>
                    <p class="summary-card__value">12 <span class="summary-card__unit">门</span>
                    </p>
                </div>
            </div>
            <div class="summary-card card">
                <div class="summary-card__icon summary-card__icon--emerald">
                    <CalendarCheck class="icon" />
                </div>
                <div>
                    <p class="summary-card__label">平均出勤率</p>
                    <p class="summary-card__value">96.5%</p>
                </div>
            </div>
            <div class="summary-card card">
                <div class="summary-card__icon summary-card__icon--amber">
                    <MapPin class="icon" />
                </div>
                <div>
                    <p class="summary-card__label">今日课程</p>
                    <p class="summary-card__value">3 <span class="summary-card__unit">节</span></p>
                </div>
            </div>
        </div>

        <!-- Course List -->
        <div class="course-list card">
            <div class="course-list__header">
                <h3 class="course-list__title">课程列表</h3>
                <div class="search">
                    <Search class="icon icon--sm search__icon" />
                    <input type="text" placeholder="搜索课程..." class="input input--search search__input" />
                </div>
            </div>
            <div class="course-list__body">
                <div v-for="course in courses" :key="course.id" class="course-row">
                    <div class="course-row__info">
                        <div class="course-row__icon">
                            {{ course.name.charAt(0) }}
                        </div>
                        <div>
                            <div class="course-row__title">
                                <h4>{{ course.name }}</h4>
                                <span class="course-row__code">{{ course.code }}</span>
                                <StatusBadge :status="course.status" />
                            </div>
                            <div class="course-row__meta">
                                <span class="course-row__meta-item">
                                    <Clock class="icon icon--xs" /> {{ course.time }}
                                </span>
                                <span class="course-row__meta-item">
                                    <MapPin class="icon icon--xs" /> {{ course.location }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="course-row__actions">
                        <button v-if="parseInt(course.attendance) < 95" @click="handleUrge(course.name)"
                            class="btn btn--outline btn--warn">
                            <BellRing class="icon icon--xs" />
                            一键催促
                        </button>
                        <div class="course-row__stat">
                            <p class="course-row__stat-label">任课教师</p>
                            <p class="course-row__stat-value">{{ course.teacher }}</p>
                        </div>

                        <div class="course-row__stat">
                            <p class="course-row__stat-label">出勤率</p>
                            <p class="course-row__stat-value"
                                :class="parseInt(course.attendance) < 95 ? 'course-row__stat-value--warning' : 'course-row__stat-value--success'">
                                {{
                                    course.attendance }}</p>
                        </div>
                        <button class="btn btn--ghost btn--icon">
                            <MoreHorizontal class="icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.summary-card {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.summary-card__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.summary-card__icon--indigo {
    background: #ede9fe;
    color: #5b21b6;
}

.summary-card__icon--emerald {
    background: #dcfce7;
    color: #15803d;
}

.summary-card__icon--amber {
    background: #fef3c7;
    color: #92400e;
}

.summary-card__label {
    font-size: 11px;
    color: var(--color-slate-500);
    text-transform: uppercase;
    font-weight: 600;
}

.summary-card__value {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-slate-900);
}

.summary-card__unit {
    font-size: 13px;
    font-weight: 400;
    color: var(--color-slate-400);
}

.course-list {
    overflow: hidden;
}

.course-list__header {
    padding: 16px;
    border-bottom: 1px solid var(--color-slate-200);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
}

.course-list__title {
    font-size: 16px;
    font-weight: 700;
}

.search {
    position: relative;
    width: 200px;
}

.search__icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-slate-400);
}

.search__input {
    width: 100%;
    background: var(--color-slate-100);
}

.course-list__body {
    display: flex;
    flex-direction: column;
}

.course-row {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: background 200ms ease;
}

.course-row:hover {
    background: #f8fafc;
}

.course-row__info {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.course-row__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #ede9fe;
    color: #5b21b6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
}

.course-row__title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.course-row__title h4 {
    margin: 0;
    font-weight: 700;
    color: var(--color-slate-900);
}

.course-row__code {
    font-size: 12px;
    color: var(--color-slate-400);
}

.course-row__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 6px;
    color: var(--color-slate-500);
    font-size: 13px;
}

.course-row__meta-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.course-row__actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
}

.btn--warn {
    border-color: #fecdd3;
    color: #e11d48;
    background: #fff1f2;
    animation: pulse 1.6s ease-in-out infinite;
}

.btn--warn:hover {
    background: #ffe4e6;
}

.course-row__stat {
    text-align: center;
}

.course-row__stat-label {
    font-size: 11px;
    color: var(--color-slate-400);
}

.course-row__stat-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-slate-700);
}

.course-row__stat-value--warning {
    color: #d97706;
}

.course-row__stat-value--success {
    color: #16a34a;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.3);
    }

    70% {
        box-shadow: 0 0 0 8px rgba(225, 29, 72, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(225, 29, 72, 0);
    }
}

@media (min-width: 640px) {
    .course-row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .course-row__actions {
        border-left: 1px solid var(--color-slate-100);
        padding-left: 16px;
    }
}
</style>
