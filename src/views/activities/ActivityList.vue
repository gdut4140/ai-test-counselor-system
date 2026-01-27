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
    <div class="space-y-6">
        <!-- Page Header -->
        <PageHeader title="活动管理">
            <template #actions>
                <button
                    class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20">
                    <Plus class="w-4 h-4 mr-2" />
                    发布活动
                </button>
            </template>
        </PageHeader>

        <!-- Filters & Search -->
        <div
            class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex items-center bg-slate-100 rounded-lg p-1">
                <button v-for="tab in tabsData" :key="tab.id" @click="setTab(tab.id)"
                    class="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
                    :class="activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                    {{ tab.name }}
                    <span v-if="tab.count" class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">{{
                        tab.count }}</span>
                </button>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
                <div class="relative flex-1 sm:flex-initial">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="搜索活动名称..."
                        class="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 transition-all" />
                </div>
                <button class="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Grid Layout for Activities -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="activity in filteredActivities" :key="activity.id"
                class="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col">
                <!-- Card Header / Cover Placeholder -->
                <div class="h-32 w-full flex items-center justify-center relative overflow-hidden"
                    :class="activity.cover">
                    <Calendar class="w-12 h-12 opacity-50" />
                    <div class="absolute top-3 right-3">
                        <StatusBadge :status="activity.status" />
                    </div>
                </div>

                <div class="p-5 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{{
                            activity.type }}</span>
                    </div>

                    <h3
                        class="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {{ activity.title }}</h3>

                    <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-slate-500">
                            <Calendar class="w-4 h-4 mr-2 text-slate-400" />
                            {{ activity.startTime }}
                        </div>
                        <div class="flex items-center text-sm text-slate-500">
                            <MapPin class="w-4 h-4 mr-2 text-slate-400" />
                            {{ activity.location }}
                        </div>
                    </div>

                    <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div class="flex items-center text-sm text-slate-600">
                            <Users class="w-4 h-4 mr-2" />
                            <span class="font-medium">{{ activity.participants }}</span>
                            <span class="text-slate-400 mx-1">/</span>
                            <span class="text-slate-400">{{ activity.maxParticipants }}</span>
                        </div>
                        <button
                            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add New Placeholder -->
            <button
                class="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all min-h-[280px]">
                <div
                    class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-primary-100">
                    <Plus class="w-6 h-6" />
                </div>
                <span class="font-medium">发布新活动</span>
            </button>
        </div>
    </div>
</template>
