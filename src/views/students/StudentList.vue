<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../../stores/students'
import type { StudentStatus } from '../../stores/students'
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

const statusLabelMap: Record<StudentStatus, string> = {
    active: '在校',
    leave: '请假',
    warning: '预警'
}

const getStudentStatusLabel = (status: StudentStatus) => statusLabelMap[status] || status

</script>

<template>
    <div class="page student-page">
        <!-- Page Header -->
        <PageHeader title="学生管理">
            <template #actions>
                <button class="btn btn-outline">
                    <RefreshCw class="icon icon-sm" />
                    同步数据
                </button>
                <button class="btn btn-primary">
                    <Download class="icon icon-sm" />
                    导出名单
                </button>
            </template>
        </PageHeader>

        <!-- Filters & Search -->
        <div class="filter-bar card">
            <div class="filter-left">
                <select class="select">
                    <option>所有专业</option>
                    <option>自动化</option>
                    <option>机器人工程</option>
                </select>
                <select class="select">
                    <option>所有班级</option>
                    <option>2301班</option>
                    <option>2302班</option>
                </select>
                <select class="select">
                    <option>状态</option>
                    <option>在校</option>
                    <option>请假</option>
                </select>
            </div>

            <div class="filter-right">
                <div class="search">
                    <Search class="icon icon-sm search-icon" />
                    <input type="text" placeholder="搜索姓名、学号..." class="input input-search search-input" />
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="table-card card">
            <div class="table-scroll">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="table-head">
                                学生信息</th>
                            <th scope="col" class="table-head">
                                班级/专业</th>
                            <th scope="col" class="table-head">
                                联系方式</th>
                            <th scope="col" class="table-head">
                                状态</th>
                            <th scope="col" class="table-head table-head-actions"><span class="sr-only">操作</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in students" :key="student.id" class="table-row">
                            <td>
                                <div class="table-cell">
                                    <div class="avatar avatar-muted">
                                        {{ student.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <div class="table-primary">{{ student.name }}</div>
                                        <div class="table-secondary">{{ student.studentNo }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="table-primary">{{ student.class }}</div>
                                <div class="table-secondary">{{ student.major }}</div>
                            </td>
                            <td>
                                <div class="contact-list">
                                    <div class="contact-item">
                                        <Phone class="icon icon-xs" />
                                        {{ student.phone }}
                                    </div>
                                    <div class="contact-item">
                                        <Mail class="icon icon-xs" />
                                        {{ student.email }}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <StatusBadge :status="student.status" :label="getStudentStatusLabel(student.status)" />
                            </td>
                            <td class="table-actions">
                                <button class="btn btn-ghost btn-icon">
                                    <MoreHorizontal class="icon" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Simple) -->
            <div class="table-footer">
                <div class="pagination-text">
                    共 {{ totalCount }} 名学生
                </div>
                <div class="pagination-nav">
                    <button disabled class="pagination-link is-disabled">上一页</button>
                    <button class="pagination-link">下一页</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens' as *;

.filter-bar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.filter-left {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.filter-right {
    width: 100%;
}

.search {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: $color-slate-400;
}

.search-input {
    width: 100%;
}

.table-card {
    overflow: hidden;
}

.table-scroll {
    overflow-x: auto;
}

.table-head {
    font-weight: 700;
}

.table-head-actions {
    text-align: right;
}

.table-row {
    transition: background 200ms ease;
}

.table-cell {
    display: flex;
    align-items: center;
    gap: 16px;
}

.table-primary {
    font-weight: 600;
    color: $color-slate-900;
}

.table-secondary {
    font-size: 12px;
    color: $color-slate-500;
}

.table-actions {
    text-align: right;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.avatar-muted {
    background: $color-slate-100;
    color: $color-slate-500;
}

.contact-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: $color-slate-600;
}

.contact-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.table-footer {
    padding: 12px 16px;
    border-top: 1px solid $color-slate-200;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.pagination-text {
    font-size: 13px;
    color: $color-slate-500;
}

.pagination-nav {
    display: inline-flex;
    gap: 8px;
}

.pagination-link {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid $color-slate-200;
    background: $color-white;
    color: $color-slate-600;
    font-size: 13px;
    cursor: pointer;
    transition: background 200ms ease;
}

.pagination-link:hover {
    background: $color-slate-100;
}

.pagination-link.is-disabled {
    color: $color-slate-400;
    cursor: not-allowed;
}

@media (min-width: 640px) {
    .filter-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .filter-right {
        width: auto;
        min-width: 240px;
    }
}
</style>
