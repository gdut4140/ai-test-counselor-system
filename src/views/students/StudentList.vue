<script setup>
import { ref } from 'vue' // Keep ref for local UI state like activeTab
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../../stores/students'
import PageHeader from '../../components/PageHeader.vue'
import StatusBadge from '../../components/StatusBadge.vue'
import {
    Search,
    Filter,
    Download,
    RefreshCw,
    MoreHorizontal,
    Mail,
    Phone
} from 'lucide-vue-next'

const studentStore = useStudentStore()
const { items: students, totalCount } = storeToRefs(studentStore)

const studentsList = students // alias for template compatibility if needed, but better to use students directly

const statusLabelMap = {
    active: '在校',
    leave: '请假',
    warning: '预警'
}

const getStudentStatusLabel = (status) => statusLabelMap[status] || status

</script>

<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <PageHeader title="学生管理">
            <template #actions>
                <button
                    class="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <RefreshCw class="w-4 h-4 mr-2" />
                    同步数据
                </button>
                <button
                    class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20">
                    <Download class="w-4 h-4 mr-2" />
                    导出名单
                </button>
            </template>
        </PageHeader>

        <!-- Filters & Search -->
        <div
            class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <select
                    class="form-select text-sm border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8">
                    <option>所有专业</option>
                    <option>自动化</option>
                    <option>机器人工程</option>
                </select>
                <select
                    class="form-select text-sm border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8">
                    <option>所有班级</option>
                    <option>2301班</option>
                    <option>2302班</option>
                </select>
                <select
                    class="form-select text-sm border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8">
                    <option>状态</option>
                    <option>在校</option>
                    <option>请假</option>
                </select>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
                <div class="relative flex-1 sm:flex-initial">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="搜索姓名、学号..."
                        class="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 transition-all" />
                </div>
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
                                班级/专业</th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                联系方式</th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                状态</th>
                            <th scope="col" class="relative px-6 py-3"><span class="sr-only">操作</span></th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        <tr v-for="student in students" :key="student.id" class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div
                                        class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                        {{ student.name.charAt(0) }}
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-slate-900">{{ student.name }}</div>
                                        <div class="text-xs text-slate-500">{{ student.studentNo }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-slate-900">{{ student.class }}</div>
                                <div class="text-xs text-slate-500">{{ student.major }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex flex-col gap-1">
                                    <div class="flex items-center text-xs text-slate-600">
                                        <Phone class="w-3 h-3 mr-1.5 text-slate-400" />
                                        {{ student.phone }}
                                    </div>
                                    <div class="flex items-center text-xs text-slate-600">
                                        <Mail class="w-3 h-3 mr-1.5 text-slate-400" />
                                        {{ student.email }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <StatusBadge :status="student.status" :label="getStudentStatusLabel(student.status)" />
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button class="text-slate-400 hover:text-primary-600 transition-colors">
                                    <MoreHorizontal class="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Simple) -->
            <div class="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
                <div class="text-sm text-slate-500">
                    共 {{ totalCount }} 名学生
                </div>
                <div class="flex gap-2">
                    <button disabled
                        class="px-3 py-1 border border-slate-200 rounded text-sm text-slate-400 cursor-not-allowed">上一页</button>
                    <button
                        class="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">下一页</button>
                </div>
            </div>
        </div>
    </div>
</template>
