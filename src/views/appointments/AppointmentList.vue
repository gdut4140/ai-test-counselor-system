<script setup>
import { ref } from 'vue'
import {
    Search,
    Filter,
    Download,
    Eye,
    Check,
    X,
    FileText
} from 'lucide-vue-next'
import { useAppointmentStore } from '../../stores/appointments'
import { computed } from 'vue' // Import computed
import { storeToRefs } from 'pinia'
import { useStatusMap } from '../../composables/useStatusMap'
import { useTabs } from '../../composables/useTabs'

const appointmentStore = useAppointmentStore()
// Use storeToRefs to keep reactivity for state/getters, but not for actions
const { items: appointments, pendingCount } = storeToRefs(appointmentStore)
// Actions can be destructured directly
const { updateStatus } = appointmentStore

const { getStatusClass, getStatusLabel } = useStatusMap()

const tabsData = [
    { id: 'all', name: '全部申请' },
    { id: 'pending', name: '待审批', count: pendingCount },
    { id: 'approved', name: '已通过' },
    { id: 'rejected', name: '已驳回' },
]

const { activeTabId: activeTab, setTab } = useTabs(tabsData)

const filteredAppointments = computed(() => {
    if (activeTab.value === 'all') return appointments.value
    return appointments.value.filter(item => item.status === activeTab.value)
})

</script>

<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 class="text-2xl font-bold text-slate-900">预约管理</h2>
            <div class="flex items-center gap-3">
                <button
                    class="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Download class="w-4 h-4 mr-2" />
                    导出记录
                </button>
            </div>
        </div>

        <!-- Filters & Search -->
        <div
            class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex items-center bg-slate-100 rounded-lg p-1">
                <button v-for="tab in tabsData" :key="tab.id" @click="setTab(tab.id)"
                    class="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
                    :class="activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                    {{ tab.name }}
                    <span v-if="tab.count" class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-rose-100 text-rose-600">{{
                        tab.count }}</span>
                </button>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
                <div class="relative flex-1 sm:flex-initial">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="搜索姓名、学号..."
                        class="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 transition-all" />
                </div>
                <button class="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                学生信息</th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                预约类型</th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                时间/地点</th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                事由</th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                状态</th>
                            <th scope="col" class="relative px-6 py-3"><span class="sr-only">操作</span></th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        <tr v-for="apt in filteredAppointments" :key="apt.id"
                            class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div
                                        class="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                                        {{ apt.student.charAt(0) }}
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-slate-900">{{ apt.student }}</div>
                                        <div class="text-xs text-slate-500">{{ apt.idNo }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                    {{ apt.type }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-slate-900">{{ apt.time.split(' ')[0] }}</div>
                                <div class="text-xs text-slate-500">{{ apt.location }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-slate-600 truncate max-w-xs" :title="apt.reason">{{ apt.reason
                                    }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="px-2.5 py-1 text-xs font-medium rounded-full border flex items-center w-fit gap-1.5"
                                    :class="getStatusClass(apt.status)">
                                    <span v-if="apt.status === 'pending'"
                                        class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    <span v-if="apt.status === 'approved'"
                                        class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {{ getStatusLabel(apt.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <button v-if="apt.status === 'pending'" @click="updateStatus(apt.id, 'approved')"
                                        class="text-primary-600 hover:text-primary-900 p-1 hover:bg-primary-50 rounded"
                                        title="通过">
                                        <Check class="w-4 h-4" />
                                    </button>
                                    <button v-if="apt.status === 'pending'" @click="updateStatus(apt.id, 'rejected')"
                                        class="text-rose-600 hover:text-rose-900 p-1 hover:bg-rose-50 rounded"
                                        title="驳回">
                                        <X class="w-4 h-4" />
                                    </button>
                                    <button class="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded"
                                        title="详情">
                                        <Eye class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-slate-700">
                            显示第 <span class="font-medium">1</span> 到 <span class="font-medium">5</span> 条，共 <span
                                class="font-medium">12</span> 条结果
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a href="#"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                上一页
                            </a>
                            <a href="#" aria-current="page"
                                class="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                1
                            </a>
                            <a href="#"
                                class="bg-white border-slate-300 text-slate-500 hover:bg-slate-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                2
                            </a>
                            <a href="#"
                                class="bg-white border-slate-300 text-slate-500 hover:bg-slate-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                3
                            </a>
                            <a href="#"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                下一页
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
