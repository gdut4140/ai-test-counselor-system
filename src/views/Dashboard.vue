<script setup>
import {
    Calendar,
    Users,
    CheckCircle,
    AlertCircle,
    MoreHorizontal
} from 'lucide-vue-next'

const stats = [
    { name: '待审批预约', value: '12', change: '+2', trend: 'up', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: '今日活动', value: '3', change: '0', trend: 'neutral', icon: Calendar, color: 'text-primary-600', bg: 'bg-primary-50' },
    { name: '学生总数', value: '248', change: '+15', trend: 'up', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: '本周签到率', value: '98%', change: '+1.2%', trend: 'up', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const appointments = [
    { id: 1, student: '张三', type: '课程辅导', time: '10:00 - 11:00', status: 'pending', reason: '高等数学难点咨询' },
    { id: 2, student: '李四', type: '场地申请', time: '14:00 - 16:00', status: 'approved', reason: '班级团建活动' },
    { id: 3, student: '王五', type: '心理咨询', time: '16:30 - 17:30', status: 'rejected', reason: '个人情绪疏导' },
]

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-slate-50 text-slate-600 border-slate-200',
}

const statusLabels = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已驳回',
}
</script>

<template>
    <div class="space-y-8">
        <!-- Welcome Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold text-slate-900">工作台</h2>
                <p class="mt-1 text-slate-500">欢迎回来，王老师。这里是今日的工作概览。</p>
            </div>
            <div class="flex gap-3">
                <button
                    class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    下载报表
                </button>
                <button
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20">
                    新建通知
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="stat in stats" :key="stat.name"
                class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div class="flex items-center justify-between">
                    <div :class="[stat.bg, 'p-3 rounded-xl']">
                        <component :is="stat.icon" :class="[stat.color, 'w-6 h-6']" />
                    </div>
                    <span class="text-xs font-medium px-2 py-1 rounded-full"
                        :class="stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                        {{ stat.change }}
                    </span>
                </div>
                <div class="mt-4">
                    <h3 class="text-3xl font-bold text-slate-900">{{ stat.value }}</h3>
                    <p class="text-sm text-slate-500 mt-1">{{ stat.name }}</p>
                </div>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Recent Appointments -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="font-bold text-slate-900">最新预约申请</h3>
                    <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">查看全部</button>
                </div>
                <div class="divide-y divide-slate-100">
                    <div v-for="apt in appointments" :key="apt.id"
                        class="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                {{ apt.student.charAt(0) }}
                            </div>
                            <div>
                                <p class="font-medium text-slate-900">{{ apt.student }} <span
                                        class="text-slate-400 font-normal mx-2">|</span> {{ apt.type }}</p>
                                <p class="text-sm text-slate-500 mt-0.5">{{ apt.time }} · {{ apt.reason }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="px-3 py-1 rounded-full text-xs font-medium border"
                                :class="statusStyles[apt.status]">
                                {{ statusLabels[apt.status] }}
                            </span>
                            <button
                                class="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                                <MoreHorizontal class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Activities / Timeline -->
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 mb-6">今日日程</h3>
                <div
                    class="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    <div class="relative pl-8">
                        <div class="absolute left-0 top-1.5 w-10 h-10 flex items-center justify-center z-10 bg-white">
                            <div class="w-3 h-3 rounded-full bg-primary-500 ring-4 ring-primary-100"></div>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-900">部门晨会</p>
                            <p class="text-xs text-slate-500 mb-1">9:00 - 10:00</p>
                            <p class="text-xs text-slate-400">行政楼 302 会议室</p>
                        </div>
                    </div>
                    <div class="relative pl-8">
                        <div class="absolute left-0 top-1.5 w-10 h-10 flex items-center justify-center z-10 bg-white">
                            <div class="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-900">张三 - 课程辅导</p>
                            <p class="text-xs text-slate-500 mb-1">10:00 - 11:00</p>
                            <p class="text-xs text-slate-400">辅导员办公室</p>
                        </div>
                    </div>
                    <div class="relative pl-8">
                        <div class="absolute left-0 top-1.5 w-10 h-10 flex items-center justify-center z-10 bg-white">
                            <div class="w-3 h-3 rounded-full bg-slate-300"></div>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-900">下午茶/休息</p>
                            <p class="text-xs text-slate-500 mb-1">15:00 - 15:30</p>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-slate-100">
                    <button
                        class="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm hover:border-primary-500 hover:text-primary-600 transition-colors">
                        + 添加日程
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
