<script setup>
import { computed } from 'vue' // Keep ref if needed for modals etc
import { storeToRefs } from 'pinia'
import { useActivityStore } from '../../stores/activities'
import { useTabs } from '../../composables/useTabs'
import PageHeader from '../../components/PageHeader.vue'
import StatusBadge from '../../components/StatusBadge.vue'
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Calendar,
    MapPin,
    Users
} from 'lucide-vue-next'

const activityStore = useActivityStore()
const { items: activities, registeringCount } = storeToRefs(activityStore)

const tabsData = [
    { id: 'all', name: '全部活动' },
    { id: 'registering', name: '报名中', count: registeringCount },
    { id: 'ongoing', name: '进行中' },
    { id: 'ended', name: '已结束' },
]

const { activeTabId: activeTab, setTab } = useTabs(tabsData)

const filteredActivities = computed(() => {
    if (activeTab.value === 'all') return activities.value
    return activities.value.filter(item => item.status === activeTab.value)
})

// const statusStyles = ... <-- Removed
// const statusLabels = ... <-- Removed
</script>

<template>
    <div class="page activity-page">
        <!-- Page Header -->
        <PageHeader title="活动管理">
            <template #actions>
                <button class="btn btn--primary">
                    <Plus class="icon icon--sm" />
                    发布活动
                </button>
            </template>
        </PageHeader>

        <!-- Filters & Search -->
        <div class="filter-bar card">
            <div class="tabs">
                <button v-for="tab in tabsData" :key="tab.id" @click="setTab(tab.id)" class="tab"
                    :class="activeTab === tab.id ? 'tab--active' : ''">
                    {{ tab.name }}
                    <span v-if="tab.count" class="tab__count">{{
                        tab.count }}</span>
                </button>
            </div>

            <div class="filter-bar__right">
                <div class="search">
                    <Search class="icon icon--sm search__icon" />
                    <input type="text" placeholder="搜索活动名称..." class="input input--search search__input" />
                </div>
                <button class="btn btn--outline btn--icon">
                    <Filter class="icon icon--sm" />
                </button>
            </div>
        </div>

        <!-- Grid Layout for Activities -->
        <div class="activity-grid">
            <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card card card--hover">
                <!-- Card Header / Cover Placeholder -->
                <div class="activity-card__cover" :class="activity.cover">
                    <Calendar class="icon activity-card__cover-icon" />
                    <div class="activity-card__badge">
                        <StatusBadge :status="activity.status" />
                    </div>
                </div>

                <div class="activity-card__body">
                    <div class="activity-card__meta">
                        <span class="tag">{{ activity.type }}</span>
                    </div>

                    <h3 class="activity-card__title">
                        {{ activity.title }}</h3>

                    <div class="activity-card__details">
                        <div class="detail-row">
                            <Calendar class="icon icon--sm detail-row__icon" />
                            {{ activity.startTime }}
                        </div>
                        <div class="detail-row">
                            <MapPin class="icon icon--sm detail-row__icon" />
                            {{ activity.location }}
                        </div>
                    </div>

                    <div class="activity-card__footer">
                        <div class="participants">
                            <Users class="icon icon--sm" />
                            <span class="participants__count">{{ activity.participants }}</span>
                            <span class="participants__divider">/</span>
                            <span class="participants__max">{{ activity.maxParticipants }}</span>
                        </div>
                        <button class="btn btn--ghost btn--icon">
                            <MoreHorizontal class="icon" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add New Placeholder -->
            <button class="activity-card activity-card--add">
                <div class="activity-card__add-icon">
                    <Plus class="icon" />
                </div>
                <span class="activity-card__add-text">发布新活动</span>
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.filter-bar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.tabs {
    display: flex;
    align-items: center;
    background: var(--color-slate-100);
    padding: 6px;
    border-radius: 12px;
    gap: 6px;
    flex-wrap: wrap;
}

.tab {
    border: none;
    background: transparent;
    padding: 6px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-slate-500);
    cursor: pointer;
    transition: background 200ms ease, color 200ms ease, box-shadow 200ms ease;
}

.tab--active {
    background: var(--color-white);
    color: var(--color-slate-900);
    box-shadow: var(--shadow-sm);
}

.tab__count {
    margin-left: 6px;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(124, 58, 237, 0.15);
    color: var(--color-primary);
    font-size: 11px;
}

.filter-bar__right {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.search {
    position: relative;
    flex: 1;
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
}

.activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
}

.activity-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.activity-card__cover {
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px solid var(--color-slate-100);
}

.activity-card__cover-icon {
    width: 48px;
    height: 48px;
    opacity: 0.5;
}

.activity-card__badge {
    position: absolute;
    top: 12px;
    right: 12px;
}

.activity-card__body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
}

.activity-card__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-primary);
    background: rgba(124, 58, 237, 0.12);
    padding: 4px 8px;
    border-radius: 8px;
}

.activity-card__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-slate-900);
}

.activity-card__details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--color-slate-500);
    font-size: 13px;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.detail-row__icon {
    color: var(--color-slate-400);
}

.activity-card__footer {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--color-slate-100);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.participants {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-slate-600);
}

.participants__count {
    font-weight: 600;
    color: var(--color-slate-900);
}

.participants__divider,
.participants__max {
    color: var(--color-slate-400);
}

.activity-card--add {
    border: 2px dashed var(--color-slate-200);
    background: transparent;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    cursor: pointer;
    transition: border-color 200ms ease, color 200ms ease, background 200ms ease;
}

.activity-card--add:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: rgba(124, 58, 237, 0.05);
}

.activity-card__add-icon {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    background: var(--color-slate-100);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.activity-card__add-text {
    font-weight: 600;
}

.cover--indigo {
    background: #ede9fe;
    color: #5b21b6;
}

.cover--blue {
    background: #dbeafe;
    color: #1d4ed8;
}

.cover--emerald {
    background: #dcfce7;
    color: #15803d;
}

@media (min-width: 640px) {
    .filter-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .filter-bar__right {
        width: auto;
    }

    .search {
        width: 260px;
    }
}
</style>
