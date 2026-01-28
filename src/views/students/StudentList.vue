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
    <div class="page student-page">
        <!-- Page Header -->
        <PageHeader title="学生管理">
            <template #actions>
                <button class="btn btn--outline">
                    <RefreshCw class="icon icon--sm" />
                    同步数据
                </button>
                <button class="btn btn--primary">
                    <Download class="icon icon--sm" />
                    导出名单
                </button>
            </template>
        </PageHeader>

        <!-- Filters & Search -->
        <div class="filter-bar card">
            <div class="filter-bar__left">
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

            <div class="filter-bar__right">
                <div class="search">
                    <Search class="icon icon--sm search__icon" />
                    <input type="text" placeholder="搜索姓名、学号..." class="input input--search search__input" />
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="table-card card">
            <div class="table-card__scroll">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="table__head-cell">
                                学生信息</th>
                            <th scope="col" class="table__head-cell">
                                班级/专业</th>
                            <th scope="col" class="table__head-cell">
                                联系方式</th>
                            <th scope="col" class="table__head-cell">
                                状态</th>
                            <th scope="col" class="table__head-cell table__head-cell--actions"><span
                                    class="sr-only">操作</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="student in students" :key="student.id" class="table__row">
                            <td>
                                <div class="table__cell-flex">
                                    <div class="avatar avatar--muted">
                                        {{ student.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <div class="table__primary">{{ student.name }}</div>
                                        <div class="table__secondary">{{ student.studentNo }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="table__primary">{{ student.class }}</div>
                                <div class="table__secondary">{{ student.major }}</div>
                            </td>
                            <td>
                                <div class="contact-list">
                                    <div class="contact-list__item">
                                        <Phone class="icon icon--xs" />
                                        {{ student.phone }}
                                    </div>
                                    <div class="contact-list__item">
                                        <Mail class="icon icon--xs" />
                                        {{ student.email }}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <StatusBadge :status="student.status" :label="getStudentStatusLabel(student.status)" />
                            </td>
                            <td class="table__actions">
                                <button class="btn btn--ghost btn--icon">
                                    <MoreHorizontal class="icon" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Simple) -->
            <div class="table-card__footer">
                <div class="pagination__text">
                    共 {{ totalCount }} 名学生
                </div>
                <div class="pagination__nav">
                    <button disabled class="pagination__link pagination__link--disabled">上一页</button>
                    <button class="pagination__link">下一页</button>
                </div>
            </div>
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

.filter-bar__left {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.filter-bar__right {
    width: 100%;
}

.search {
    position: relative;
    width: 100%;
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

.table-card {
    overflow: hidden;
}

.table-card__scroll {
    overflow-x: auto;
}

.table__head-cell {
    font-weight: 700;
}

.table__head-cell--actions {
    text-align: right;
}

.table__row {
    transition: background 200ms ease;
}

.table__cell-flex {
    display: flex;
    align-items: center;
    gap: 16px;
}

.table__primary {
    font-weight: 600;
    color: var(--color-slate-900);
}

.table__secondary {
    font-size: 12px;
    color: var(--color-slate-500);
}

.table__actions {
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

.avatar--muted {
    background: var(--color-slate-100);
    color: var(--color-slate-500);
}

.contact-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: var(--color-slate-600);
}

.contact-list__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.table-card__footer {
    padding: 12px 16px;
    border-top: 1px solid var(--color-slate-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.pagination__text {
    font-size: 13px;
    color: var(--color-slate-500);
}

.pagination__nav {
    display: inline-flex;
    gap: 8px;
}

.pagination__link {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--color-slate-200);
    background: var(--color-white);
    color: var(--color-slate-600);
    font-size: 13px;
    cursor: pointer;
    transition: background 200ms ease;
}

.pagination__link:hover {
    background: var(--color-slate-100);
}

.pagination__link--disabled {
    color: var(--color-slate-400);
    cursor: not-allowed;
}

@media (min-width: 640px) {
    .filter-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .filter-bar__right {
        width: auto;
        min-width: 240px;
    }
}
</style>
