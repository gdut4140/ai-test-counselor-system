<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '../../stores/students'
import type { StudentStatus } from '../../stores/students'
import PageHeader from '../../components/PageHeader.vue'
import StatusBadge from '../../components/StatusBadge.vue'
import {
    Search,
    Download,
    RefreshCw,
    MoreHorizontal,
    Mail,
    Phone
} from 'lucide-vue-next'

const studentStore = useStudentStore()
const { items: students, attendanceStats } = storeToRefs(studentStore)

const selectedCollege = ref('all')
const selectedMajor = ref('all')
const selectedClass = ref('all')
const selectedStatus = ref('all')
const searchTerm = ref('')

const collegeOptions = computed(() => Array.from(new Set(students.value.map(s => s.college))))
const majorOptions = computed(() => {
    const filtered = selectedCollege.value === 'all'
        ? students.value
        : students.value.filter(s => s.college === selectedCollege.value)
    return Array.from(new Set(filtered.map(s => s.major)))
})
const classOptions = computed(() => {
    const filtered = students.value.filter(s => {
        if (selectedCollege.value !== 'all' && s.college !== selectedCollege.value) return false
        if (selectedMajor.value !== 'all' && s.major !== selectedMajor.value) return false
        return true
    })
    return Array.from(new Set(filtered.map(s => s.class)))
})

const filteredStudents = computed(() => {
    return students.value.filter(student => {
        if (selectedCollege.value !== 'all' && student.college !== selectedCollege.value) return false
        if (selectedMajor.value !== 'all' && student.major !== selectedMajor.value) return false
        if (selectedClass.value !== 'all' && student.class !== selectedClass.value) return false
        if (selectedStatus.value !== 'all' && student.status !== selectedStatus.value) return false
        if (searchTerm.value) {
            const keyword = searchTerm.value.trim().toLowerCase()
            const text = `${student.name}${student.studentNo}${student.class}${student.major}${student.college}`.toLowerCase()
            if (!text.includes(keyword)) return false
        }
        return true
    })
})

const filteredCount = computed(() => filteredStudents.value.length)

watch(selectedClass, async (value) => {
    if (value === 'all') {
        attendanceStats.value = null
        return
    }
    const target = students.value.find(s => s.class === value)
    if (!target) return
    await studentStore.fetchAttendanceStats(target.classId)
})

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
                <select v-model="selectedCollege" class="select">
                    <option value="all">所有学院</option>
                    <option v-for="college in collegeOptions" :key="college" :value="college">{{ college }}</option>
                </select>
                <select v-model="selectedMajor" class="select">
                    <option value="all">所有专业</option>
                    <option v-for="major in majorOptions" :key="major" :value="major">{{ major }}</option>
                </select>
                <select v-model="selectedClass" class="select">
                    <option value="all">所有班级</option>
                    <option v-for="className in classOptions" :key="className" :value="className">{{ className }}
                    </option>
                </select>
                <select v-model="selectedStatus" class="select">
                    <option value="all">状态</option>
                    <option value="active">在校</option>
                    <option value="leave">请假</option>
                    <option value="warning">预警</option>
                </select>
            </div>

            <div class="filter-right">
                <div class="search">
                    <Search class="icon icon-sm search-icon" />
                    <input v-model="searchTerm" type="text" placeholder="搜索姓名、学号、学院..."
                        class="input input-search search-input" />
                </div>
            </div>
        </div>

        <div v-if="attendanceStats && selectedClass !== 'all'" class="attendance-card card">
            <div class="attendance-header">
                <div>
                    <p class="attendance-label">考勤统计</p>
                    <p class="attendance-class">{{ attendanceStats.className }}</p>
                </div>
                <div class="attendance-rate">
                    <span class="attendance-rate-label">出勤率</span>
                    <span class="attendance-rate-value">{{ attendanceStats.attendanceRate }}</span>
                </div>
            </div>
            <div class="attendance-body">
                <p class="attendance-subtitle">缺勤名单</p>
                <div class="attendance-list">
                    <div v-for="item in attendanceStats.absentList" :key="item.studentId" class="attendance-item">
                        <div>
                            <p class="attendance-name">{{ item.studentName }}</p>
                            <p class="attendance-id">{{ item.studentIdNumber }}</p>
                        </div>
                        <span class="attendance-count">{{ item.absentCount }} 次</span>
                    </div>
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
                        <tr v-for="student in filteredStudents" :key="student.id" class="table-row">
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
                                <div class="table-secondary">{{ student.major }} · {{ student.college }}</div>
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
                    共 {{ filteredCount }} 名学生
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
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
}

.filter-left {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.filter-left .select {
    width: 100%;
}

.filter-right {
    display: flex;
    justify-content: flex-end;
}

.search {
    position: relative;
    width: min(320px, 100%);
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

.attendance-card {
    margin-top: 16px;
    padding: 16px;
}

.attendance-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.attendance-label {
    font-size: 12px;
    color: $color-slate-500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.attendance-class {
    font-size: 16px;
    font-weight: 700;
    color: $color-slate-900;
}

.attendance-rate {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.attendance-rate-label {
    font-size: 12px;
    color: $color-slate-500;
}

.attendance-rate-value {
    font-size: 20px;
    font-weight: 700;
    color: $color-primary;
}

.attendance-body {
    margin-top: 16px;
}

.attendance-subtitle {
    font-size: 13px;
    font-weight: 600;
    color: $color-slate-700;
    margin-bottom: 12px;
}

.attendance-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.attendance-item {
    padding: 12px;
    border-radius: 12px;
    background: $color-slate-50;
    border: 1px solid $color-slate-100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.attendance-name {
    font-weight: 600;
    color: $color-slate-900;
}

.attendance-id {
    font-size: 12px;
    color: $color-slate-500;
}

.attendance-count {
    font-size: 12px;
    font-weight: 600;
    color: $color-rose-600;
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

@media (min-width: 768px) {
    .filter-bar {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
    }

    .filter-right {
        justify-content: flex-end;
    }
}
</style>
