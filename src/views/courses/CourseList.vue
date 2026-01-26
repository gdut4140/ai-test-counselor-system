<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '../../stores/courses'
import {
    Search,
    BookOpen,
    MapPin,
    Clock,
    MoreHorizontal,
    CalendarCheck
} from 'lucide-vue-next'

const courseStore = useCourseStore()
const { courses } = storeToRefs(courseStore) // Make courses reactive
// const courses = ref([...]) <-- Removed local definition

const statusColors = {
    ongoing: 'text-emerald-600',
    warning: 'text-amber-600',
    ended: 'text-slate-400'
}
</script>

<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 class="text-2xl font-bold text-slate-900">课程管理</h2>
            <div class="flex items-center gap-3">
                <button
                    class="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <CalendarCheck class="w-4 h-4 mr-2" />
                    考勤统计
                </button>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div class="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <BookOpen class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-xs text-slate-500 font-medium uppercase">本学期课程</p>
                    <p class="text-2xl font-bold text-slate-900">12 <span
                            class="text-sm font-normal text-slate-400">门</span></p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div class="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                    <CalendarCheck class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-xs text-slate-500 font-medium uppercase">平均出勤率</p>
                    <p class="text-2xl font-bold text-slate-900">96.5%</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div class="p-3 bg-amber-50 rounded-lg text-amber-600">
                    <MapPin class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-xs text-slate-500 font-medium uppercase">今日课程</p>
                    <p class="text-2xl font-bold text-slate-900">3 <span
                            class="text-sm font-normal text-slate-400">节</span></p>
                </div>
            </div>
        </div>

        <!-- Course List -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 class="font-bold text-slate-900">课程列表</h3>
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="搜索课程..."
                        class="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 w-48 transition-all" />
                </div>
            </div>
            <div class="divide-y divide-slate-100">
                <div v-for="course in courses" :key="course.id"
                    class="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                            {{ course.name.charAt(0) }}
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-900">{{ course.name }} <span
                                    class="text-xs font-normal text-slate-400 ml-2">{{ course.code }}</span></h4>
                            <div class="flex flex-wrap items-center gap-4 mt-1">
                                <span class="text-sm text-slate-500 flex items-center">
                                    <Clock class="w-3.5 h-3.5 mr-1.5" /> {{ course.time }}
                                </span>
                                <span class="text-sm text-slate-500 flex items-center">
                                    <MapPin class="w-3.5 h-3.5 mr-1.5" /> {{ course.location }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-6 sm:pl-4 sm:border-l sm:border-slate-100">
                        <div class="text-center">
                            <p class="text-xs text-slate-400 mb-0.5">任课教师</p>
                            <p class="text-sm font-medium text-slate-700">{{ course.teacher }}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-xs text-slate-400 mb-0.5">出勤率</p>
                            <p class="text-sm font-bold"
                                :class="parseInt(course.attendance) < 95 ? 'text-amber-600' : 'text-emerald-600'">{{
                                    course.attendance }}</p>
                        </div>
                        <button
                            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2">
                            <MoreHorizontal class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
