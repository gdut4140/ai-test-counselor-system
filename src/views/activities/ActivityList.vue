<script setup lang="ts">
import { computed, ref, onMounted } from 'vue' // Keep ref if needed for modals etc
import { storeToRefs } from 'pinia'
import { useActivityStore } from '../../stores/activities'
import type { Activity, ActivityCreateInput } from '../../stores/activities'
import { useTabs } from '../../composables/useTabs'
import PageHeader from '../../components/PageHeader.vue'
import StatusBadge from '../../components/StatusBadge.vue'
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    X,
    Calendar,
    MapPin,
    Users,
    Eye,
    Pencil,
    Trash2,
    UploadCloud,
    DownloadCloud,
    ClipboardList,
    UserCheck,
    RefreshCw
} from 'lucide-vue-next'

const activityStore = useActivityStore()
const { items: activities, registeringCount, isLoading, error, todayActivitiesCount } = storeToRefs(activityStore)

type RegistrationItem = {
    registrationId: number
    studentName: string
    studentIdNumber: string
    className: string
}

type ParticipationItem = {
    participationId: number
    studentName: string
    studentIdNumber: string
    className: string
    checkInStatus: string
    checkOutStatus: string
}

const searchTerm = ref('')
const isCreating = ref(false)
const showCreateModal = ref(false)
const createError = ref('')
const isRefreshing = ref(false)

const formTitle = ref('')
const formType = ref('')
const formStartTime = ref('')
const formLocation = ref('')
const formMaxParticipants = ref<number | null>(null)
const formDescription = ref('')

const showEditModal = ref(false)
const editError = ref('')
const isUpdating = ref(false)
const editingId = ref<number | null>(null)

const showDetailModal = ref(false)
const detailActivity = ref<Activity | null>(null)
const detailLoading = ref(false)
const detailError = ref('')

const showRegistrationModal = ref(false)
const registrationActivity = ref<Activity | null>(null)
const registrationList = ref<RegistrationItem[]>([])
const registrationLoading = ref(false)
const registrationError = ref('')

const showParticipationModal = ref(false)
const participationActivity = ref<Activity | null>(null)
const participationList = ref<ParticipationItem[]>([])
const participationLoading = ref(false)
const participationError = ref('')

const actionBusy = ref<{ id: number, type: string } | null>(null)
const selectedActivityId = ref<number | null>(null)

const tabsData = [
    { id: 'all', name: '全部活动' },
    { id: 'registering', name: '报名中', count: registeringCount },
    { id: 'ongoing', name: '进行中' },
    { id: 'ended', name: '已结束' },
]

const { activeTabId: activeTab, setTab } = useTabs(tabsData)

const isActionBusy = (id: number, type: string) => actionBusy.value?.id === id && actionBusy.value?.type === type
const selectedActivity = computed(() => activities.value.find(item => item.id === selectedActivityId.value) || null)

const filteredActivities = computed<Activity[]>(() => {
    const keyword = searchTerm.value.trim().toLowerCase()
    const filtered = activeTab.value === 'all'
        ? activities.value
        : activities.value.filter(item => item.status === activeTab.value)

    if (!keyword) return filtered
    return filtered.filter(item => item.title.toLowerCase().includes(keyword))
})

const openCreateModal = () => {
    resetForm()
    editingId.value = null
    showCreateModal.value = true
    createError.value = ''
}

const closeCreateModal = () => {
    showCreateModal.value = false
    createError.value = ''
}

const openEditModal = (activity: Activity) => {
    editingId.value = activity.id
    formTitle.value = activity.title
    formType.value = activity.type
    formStartTime.value = activity.startTime
    formLocation.value = activity.location
    formMaxParticipants.value = activity.maxParticipants
    formDescription.value = activity.description || ''
    showEditModal.value = true
    editError.value = ''
}

const closeEditModal = () => {
    showEditModal.value = false
    editError.value = ''
    editingId.value = null
    resetForm()
}

const resetForm = () => {
    formTitle.value = ''
    formType.value = ''
    formStartTime.value = ''
    formLocation.value = ''
    formMaxParticipants.value = null
    formDescription.value = ''
}

const handleCreateSubmit = async () => {
    if (isCreating.value) return
    createError.value = ''

    if (!formTitle.value || !formType.value || !formStartTime.value || !formLocation.value || !formMaxParticipants.value) {
        createError.value = '请完整填写活动名称、类型、时间、地点和人数。'
        return
    }

    const payload: ActivityCreateInput = {
        title: formTitle.value,
        type: formType.value,
        startTime: formStartTime.value,
        location: formLocation.value,
        maxParticipants: formMaxParticipants.value,
        description: formDescription.value
    }

    isCreating.value = true
    try {
        await activityStore.createActivity(payload)
        resetForm()
        closeCreateModal()
    } finally {
        isCreating.value = false
    }
}

const handleEditSubmit = async () => {
    if (isUpdating.value || !editingId.value) return
    editError.value = ''

    if (!formTitle.value || !formType.value || !formStartTime.value || !formLocation.value || !formMaxParticipants.value) {
        editError.value = '请完整填写活动名称、类型、时间、地点和人数。'
        return
    }

    const payload: ActivityCreateInput = {
        title: formTitle.value,
        type: formType.value,
        startTime: formStartTime.value,
        location: formLocation.value,
        maxParticipants: formMaxParticipants.value,
        description: formDescription.value
    }

    isUpdating.value = true
    try {
        await activityStore.updateActivity(editingId.value, payload)
        closeEditModal()
    } finally {
        isUpdating.value = false
    }
}

const refreshList = async () => {
    if (isRefreshing.value) return
    isRefreshing.value = true
    try {
        await activityStore.fetchActivities()
    } finally {
        isRefreshing.value = false
    }
}

const handlePublishToggle = async (activity: Activity) => {
    if (isActionBusy(activity.id, 'publish')) return
    actionBusy.value = { id: activity.id, type: 'publish' }
    try {
        if (activity.publishStatus === 'published') {
            await activityStore.unpublishActivity(activity.id)
        } else {
            await activityStore.publishActivity(activity.id)
        }
    } finally {
        actionBusy.value = null
    }
}

const handleDelete = async (activity: Activity) => {
    if (isActionBusy(activity.id, 'delete')) return
    if (!window.confirm(`确定删除活动「${activity.title}」吗？`)) return
    actionBusy.value = { id: activity.id, type: 'delete' }
    try {
        await activityStore.deleteActivity(activity.id)
    } finally {
        actionBusy.value = null
    }
}

const openDetailModal = async (activityId: number) => {
    showDetailModal.value = true
    detailLoading.value = true
    detailError.value = ''
    detailActivity.value = null
    try {
        detailActivity.value = await activityStore.fetchActivityDetail(activityId)
    } catch (err) {
        detailError.value = err instanceof Error ? err.message : '加载活动详情失败'
    } finally {
        detailLoading.value = false
    }
}

const closeDetailModal = () => {
    showDetailModal.value = false
    detailActivity.value = null
    detailError.value = ''
}

const openRegistrationModal = async (activity: Activity) => {
    showRegistrationModal.value = true
    registrationActivity.value = activity
    registrationLoading.value = true
    registrationError.value = ''
    registrationList.value = []
    try {
        const data = await activityStore.fetchActivityRegistrations(activity.id)
        registrationList.value = data as RegistrationItem[]
    } catch (err) {
        registrationError.value = err instanceof Error ? err.message : '加载报名列表失败'
    } finally {
        registrationLoading.value = false
    }
}

const closeRegistrationModal = () => {
    showRegistrationModal.value = false
    registrationActivity.value = null
    registrationList.value = []
    registrationError.value = ''
}


const openParticipationModal = async (activity: Activity) => {
    showParticipationModal.value = true
    participationActivity.value = activity
    participationLoading.value = true
    participationError.value = ''
    participationList.value = []
    try {
        const data = await activityStore.fetchActivityParticipation(activity.id)
        participationList.value = data as ParticipationItem[]
    } catch (err) {
        participationError.value = err instanceof Error ? err.message : '加载参与情况失败'
    } finally {
        participationLoading.value = false
    }
}

const closeParticipationModal = () => {
    showParticipationModal.value = false
    participationActivity.value = null
    participationList.value = []
    participationError.value = ''
}

const selectActivity = (activity: Activity) => {
    selectedActivityId.value = activity.id
}

onMounted(() => {
    activityStore.fetchActivities()
})

// const statusStyles = ... <-- Removed
// const statusLabels = ... <-- Removed
</script>

<template>
    <div class="page activity-page">
        <!-- Page Header -->
        <PageHeader title="活动管理" :subtitle="`今日活动 ${todayActivitiesCount} 场`">
            <template #actions>
                <div class="taskbar">
                    <button class="btn btn-outline btn-icon" @click="refreshList" :disabled="isRefreshing">
                        <RefreshCw class="icon icon-sm" />
                    </button>
                    <button class="btn btn-primary" @click="openCreateModal">
                        <Plus class="icon icon-sm" />
                        发布活动
                    </button>
                </div>
            </template>
        </PageHeader>

        <div class="activity-toolbar card">
            <div class="toolbar-info">
                <span class="toolbar-label">当前选中</span>
                <span class="toolbar-value">{{ selectedActivity?.title || '未选择活动' }}</span>
            </div>
            <div class="toolbar-actions">
                <button class="btn btn-outline btn-icon" :disabled="!selectedActivity"
                    @click="selectedActivity && openDetailModal(selectedActivity.id)">
                    <Eye class="icon icon-sm" />
                    详情
                </button>
                <button class="btn btn-outline btn-icon" :disabled="!selectedActivity"
                    @click="selectedActivity && openEditModal(selectedActivity)">
                    <Pencil class="icon icon-sm" />
                    编辑
                </button>
                <button class="btn btn-outline btn-icon" :disabled="!selectedActivity"
                    @click="selectedActivity && openRegistrationModal(selectedActivity)">
                    <ClipboardList class="icon icon-sm" />
                    报名
                </button>
                <button class="btn btn-outline btn-icon" :disabled="!selectedActivity"
                    @click="selectedActivity && openParticipationModal(selectedActivity)">
                    <UserCheck class="icon icon-sm" />
                    参与
                </button>
                <button class="btn btn-outline btn-icon"
                    :disabled="!selectedActivity || (selectedActivity && isActionBusy(selectedActivity.id, 'publish'))"
                    @click="selectedActivity && handlePublishToggle(selectedActivity)">
                    <UploadCloud v-if="selectedActivity?.publishStatus !== 'published'" class="icon icon-sm" />
                    <DownloadCloud v-else class="icon icon-sm" />
                    {{ selectedActivity?.publishStatus === 'published' ? '下线' : '发布' }}
                </button>
                <button class="btn btn-outline btn-icon is-danger"
                    :disabled="!selectedActivity || (selectedActivity && isActionBusy(selectedActivity.id, 'delete'))"
                    @click="selectedActivity && handleDelete(selectedActivity)">
                    <Trash2 class="icon icon-sm" />
                    删除
                </button>
            </div>
        </div>

        <!-- Filters & Search -->
        <div class="filter-bar card">
            <div class="tabs">
                <button v-for="tab in tabsData" :key="tab.id" @click="setTab(tab.id)" class="tab"
                    :class="activeTab === tab.id ? 'tab-active' : ''">
                    {{ tab.name }}
                    <span v-if="tab.count" class="tab-count">{{
                        tab.count }}</span>
                </button>
            </div>

            <div class="filter-right">
                <div class="search">
                    <Search class="icon icon-sm search-icon" />
                    <input v-model="searchTerm" type="text" placeholder="搜索活动名称..."
                        class="input input-search search-input" />
                </div>
                <button class="btn btn-outline btn-icon">
                    <Filter class="icon icon-sm" />
                </button>
            </div>
        </div>

        <!-- Grid Layout for Activities -->
        <div class="activity-grid">
            <div v-if="isLoading" class="activity-empty card">
                正在加载活动...
            </div>
            <div v-else-if="error" class="activity-empty card">
                {{ error.message }}
            </div>
            <div v-else-if="!filteredActivities.length" class="activity-empty card">
                暂无符合条件的活动
            </div>
            <template v-else>
                <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card card card-hover"
                    :class="selectedActivityId === activity.id ? 'is-selected' : ''" @click="selectActivity(activity)">
                    <!-- Card Header / Cover Placeholder -->
                    <div class="card-cover" :class="activity.cover">
                        <Calendar class="icon cover-icon" />
                        <div class="card-badge">
                            <StatusBadge :status="activity.status" />
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="card-meta">
                            <button class="tag tag-button" type="button" @click.stop="openDetailModal(activity.id)">
                                {{ activity.type }}
                            </button>
                            <span class="publish-badge"
                                :class="activity.publishStatus === 'published' ? 'is-published' : 'is-unpublished'">
                                {{ activity.publishStatus === 'published' ? '已发布' : '未发布' }}
                            </span>
                        </div>

                        <h3 class="card-title">
                            {{ activity.title }}</h3>

                        <div class="card-details">
                            <div class="detail-row">
                                <Calendar class="icon icon-sm detail-icon" />
                                {{ activity.startTime }}
                            </div>
                            <div class="detail-row">
                                <MapPin class="icon icon-sm detail-icon" />
                                {{ activity.location }}
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="participants">
                                <Users class="icon icon-sm" />
                                <span class="participants-count">{{ activity.participants }}</span>
                                <span class="participants-divider">/</span>
                                <span class="participants-max">{{ activity.maxParticipants }}</span>
                            </div>
                            <button class="btn btn-ghost btn-icon" @click.stop="openDetailModal(activity.id)">
                                <MoreHorizontal class="icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Add New Placeholder -->
            <button class="activity-card card-add" @click="openCreateModal">
                <div class="add-icon">
                    <Plus class="icon" />
                </div>
                <span class="add-text">发布新活动</span>
            </button>
        </div>

        <div v-if="showCreateModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-backdrop" @click="closeCreateModal"></div>
            <div class="modal-card">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">创建活动</h3>
                        <p class="modal-subtitle">填写活动内容、类型与人数等信息。</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" @click="closeCreateModal">
                        <X class="icon" />
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-field">
                            <label class="form-label">活动名称</label>
                            <input v-model="formTitle" type="text" class="input" placeholder="请输入活动名称" />
                        </div>
                        <div class="form-field">
                            <label class="form-label">活动类型</label>
                            <select v-model="formType" class="select">
                                <option value="" disabled>请选择活动类型</option>
                                <option value="讲座">讲座</option>
                                <option value="沙龙">沙龙</option>
                                <option value="工作坊">工作坊</option>
                                <option value="宣讲">宣讲</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label class="form-label">开始时间</label>
                            <input v-model="formStartTime" type="datetime-local" class="input" />
                        </div>
                        <div class="form-field">
                            <label class="form-label">活动地点</label>
                            <input v-model="formLocation" type="text" class="input" placeholder="请输入活动地点" />
                        </div>
                        <div class="form-field">
                            <label class="form-label">人数上限</label>
                            <input v-model.number="formMaxParticipants" type="number" min="1" class="input"
                                placeholder="请输入人数上限" />
                        </div>
                        <div class="form-field form-full">
                            <label class="form-label">活动描述</label>
                            <textarea v-model="formDescription" rows="3" class="input" placeholder="补充活动说明"></textarea>
                        </div>
                    </div>

                    <p v-if="createError" class="form-error">{{ createError }}</p>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-outline" @click="closeCreateModal">取消</button>
                    <button class="btn btn-primary" :disabled="isCreating" @click="handleCreateSubmit">
                        <span v-if="!isCreating">确认创建</span>
                        <span v-else>创建中...</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showEditModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-backdrop" @click="closeEditModal"></div>
            <div class="modal-card">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">编辑活动</h3>
                        <p class="modal-subtitle">更新活动信息后将同步到活动列表。</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" @click="closeEditModal">
                        <X class="icon" />
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-field">
                            <label class="form-label">活动名称</label>
                            <input v-model="formTitle" type="text" class="input" placeholder="请输入活动名称" />
                        </div>
                        <div class="form-field">
                            <label class="form-label">活动类型</label>
                            <select v-model="formType" class="select">
                                <option value="" disabled>请选择活动类型</option>
                                <option value="讲座">讲座</option>
                                <option value="沙龙">沙龙</option>
                                <option value="工作坊">工作坊</option>
                                <option value="宣讲">宣讲</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label class="form-label">开始时间</label>
                            <input v-model="formStartTime" type="datetime-local" class="input" />
                        </div>
                        <div class="form-field">
                            <label class="form-label">活动地点</label>
                            <input v-model="formLocation" type="text" class="input" placeholder="请输入活动地点" />
                        </div>
                        <div class="form-field">
                            <label class="form-label">人数上限</label>
                            <input v-model.number="formMaxParticipants" type="number" min="1" class="input"
                                placeholder="请输入人数上限" />
                        </div>
                        <div class="form-field form-full">
                            <label class="form-label">活动描述</label>
                            <textarea v-model="formDescription" rows="3" class="input" placeholder="补充活动说明"></textarea>
                        </div>
                    </div>

                    <p v-if="editError" class="form-error">{{ editError }}</p>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-outline" @click="closeEditModal">取消</button>
                    <button class="btn btn-primary" :disabled="isUpdating" @click="handleEditSubmit">
                        <span v-if="!isUpdating">保存修改</span>
                        <span v-else>保存中...</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showDetailModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-backdrop" @click="closeDetailModal"></div>
            <div class="modal-card modal-wide">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">活动详情</h3>
                        <p class="modal-subtitle">查看活动基本信息与发布状态。</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" @click="closeDetailModal">
                        <X class="icon" />
                    </button>
                </div>

                <div class="modal-body">
                    <div v-if="detailLoading" class="modal-empty">正在加载详情...</div>
                    <div v-else-if="detailError" class="modal-empty">{{ detailError }}</div>
                    <div v-else-if="detailActivity" class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">活动名称</span>
                            <span class="detail-value">{{ detailActivity.title }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">活动类型</span>
                            <span class="detail-value">{{ detailActivity.type }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">活动时间</span>
                            <span class="detail-value">{{ detailActivity.startTime }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">活动地点</span>
                            <span class="detail-value">{{ detailActivity.location }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">报名人数</span>
                            <span class="detail-value">{{ detailActivity.participants }}/{{
                                detailActivity.maxParticipants
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">发布状态</span>
                            <span class="detail-value">
                                {{ detailActivity.publishStatus === 'published' ? '已发布' : '未发布' }}
                            </span>
                        </div>
                        <div class="detail-item detail-full">
                            <span class="detail-label">活动描述</span>
                            <span class="detail-value">{{ detailActivity.description || '暂无描述' }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-outline" @click="closeDetailModal">关闭</button>
                </div>
            </div>
        </div>

        <div v-if="showRegistrationModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-backdrop" @click="closeRegistrationModal"></div>
            <div class="modal-card modal-wide">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">报名成功名单</h3>
                        <p class="modal-subtitle">{{ registrationActivity?.title }}</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" @click="closeRegistrationModal">
                        <X class="icon" />
                    </button>
                </div>

                <div class="modal-body">
                    <div v-if="registrationLoading" class="modal-empty">正在加载报名信息...</div>
                    <div v-else-if="registrationError" class="modal-empty">{{ registrationError }}</div>
                    <div v-else-if="!registrationList.length" class="modal-empty">暂无报名记录</div>
                    <div v-else class="list-table list-table-registration">
                        <div class="list-row list-head">
                            <span>姓名</span>
                            <span>学号</span>
                            <span>班级</span>
                        </div>
                        <div v-for="item in registrationList" :key="item.registrationId" class="list-row">
                            <span>{{ item.studentName }}</span>
                            <span>{{ item.studentIdNumber }}</span>
                            <span>{{ item.className }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-outline" @click="closeRegistrationModal">关闭</button>
                </div>
            </div>
        </div>

        <div v-if="showParticipationModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-backdrop" @click="closeParticipationModal"></div>
            <div class="modal-card modal-wide">
                <div class="modal-header">
                    <div>
                        <h3 class="modal-title">参与情况</h3>
                        <p class="modal-subtitle">{{ participationActivity?.title }}</p>
                    </div>
                    <button class="btn btn-ghost btn-icon" @click="closeParticipationModal">
                        <X class="icon" />
                    </button>
                </div>

                <div class="modal-body">
                    <div v-if="participationLoading" class="modal-empty">正在加载参与信息...</div>
                    <div v-else-if="participationError" class="modal-empty">{{ participationError }}</div>
                    <div v-else-if="!participationList.length" class="modal-empty">暂无参与记录</div>
                    <div v-else class="list-table">
                        <div class="list-row list-head">
                            <span>姓名</span>
                            <span>学号</span>
                            <span>班级</span>
                            <span>签到</span>
                            <span>签退</span>
                        </div>
                        <div v-for="item in participationList" :key="item.participationId" class="list-row">
                            <span>{{ item.studentName }}</span>
                            <span>{{ item.studentIdNumber }}</span>
                            <span>{{ item.className }}</span>
                            <span>{{ item.checkInStatus }}</span>
                            <span>{{ item.checkOutStatus }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-outline" @click="closeParticipationModal">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens' as *;

.activity-page {
    .taskbar {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .activity-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 16px;
        flex-wrap: wrap;

        .toolbar-info {
            display: flex;
            align-items: center;
            gap: 8px;

            .toolbar-label {
                font-size: 12px;
                color: $color-slate-500;
            }

            .toolbar-value {
                font-size: 14px;
                font-weight: 600;
                color: $color-slate-900;
            }
        }

        .toolbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;

            .btn.is-danger {
                color: #e11d48;
            }
        }
    }

    .filter-bar {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;

        .tabs {
            display: flex;
            align-items: center;
            background: $color-slate-100;
            padding: 6px;
            border-radius: 12px;
            gap: 6px;
            flex-wrap: wrap;

            .tab {
                border: none;
                background: transparent;
                padding: 6px 14px;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 600;
                color: $color-slate-500;
                cursor: pointer;
                transition: background 200ms ease, color 200ms ease, box-shadow 200ms ease;

                &.tab-active {
                    background: $color-white;
                    color: $color-slate-900;
                    box-shadow: $shadow-sm;
                }

                .tab-count {
                    margin-left: 6px;
                    padding: 2px 6px;
                    border-radius: 999px;
                    background: rgba(124, 58, 237, 0.15);
                    color: $color-primary;
                    font-size: 11px;
                }
            }
        }

        .filter-right {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;

            .search {
                position: relative;
                flex: 1;

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
            }
        }
    }

    .activity-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;

        .activity-empty {
            padding: 32px;
            text-align: center;
            color: $color-slate-500;
            font-size: 14px;
        }

        .activity-card {
            display: flex;
            flex-direction: column;
            overflow: hidden;

            &.is-selected {
                border-color: rgba(124, 58, 237, 0.5);
                box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
            }

            &.card-add {
                border: 2px dashed $color-slate-200;
                background: transparent;
                align-items: center;
                justify-content: center;
                min-height: 280px;
                cursor: pointer;
                transition: border-color 200ms ease, color 200ms ease, background 200ms ease;

                &:hover {
                    border-color: $color-primary;
                    color: $color-primary;
                    background: rgba(124, 58, 237, 0.05);
                }

                .add-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 999px;
                    background: $color-slate-100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                }

                .add-text {
                    font-weight: 600;
                }
            }

            .card-cover {
                height: 128px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                border-bottom: 1px solid $color-slate-100;

                &.cover-indigo {
                    background: #ede9fe;
                    color: #5b21b6;
                }

                &.cover-blue {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                &.cover-emerald {
                    background: #dcfce7;
                    color: #15803d;
                }

                .cover-icon {
                    width: 48px;
                    height: 48px;
                    opacity: 0.5;
                }

                .card-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                }
            }

            .card-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex: 1;

                .card-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .tag {
                        font-size: 11px;
                        font-weight: 600;
                        color: $color-primary;
                        background: rgba(124, 58, 237, 0.12);
                        padding: 4px 8px;
                        border-radius: 8px;
                        border: none;
                        cursor: pointer;
                    }

                    .tag-button {
                        transition: background 200ms ease, color 200ms ease;

                        &:hover {
                            background: rgba(124, 58, 237, 0.2);
                        }
                    }

                    .publish-badge {
                        font-size: 11px;
                        font-weight: 600;
                        padding: 4px 8px;
                        border-radius: 999px;

                        &.is-published {
                            background: #dcfce7;
                            color: #166534;
                        }

                        &.is-unpublished {
                            background: #f1f5f9;
                            color: #475569;
                        }
                    }
                }

                .card-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: $color-slate-900;
                }

                .card-details {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    color: $color-slate-500;
                    font-size: 13px;

                    .detail-row {
                        display: flex;
                        align-items: center;
                        gap: 8px;

                        .detail-icon {
                            color: $color-slate-400;
                        }
                    }
                }

                .card-footer {
                    margin-top: auto;
                    padding-top: 16px;
                    border-top: 1px solid $color-slate-100;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;

                    .participants {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 13px;
                        color: $color-slate-600;

                        .participants-count {
                            font-weight: 600;
                            color: $color-slate-900;
                        }

                        .participants-divider,
                        .participants-max {
                            color: $color-slate-400;
                        }
                    }
                }
            }
        }
    }

    .modal {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;

        .modal-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.4);
        }

        .modal-card {
            position: relative;
            width: min(680px, 92vw);
            background: $color-white;
            border-radius: 20px;
            box-shadow: $shadow-lg;
            border: 1px solid $color-slate-100;
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px;

            &.modal-wide {
                width: min(860px, 92vw);
            }

            .modal-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 16px;

                .modal-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: $color-slate-900;
                }

                .modal-subtitle {
                    margin-top: 6px;
                    font-size: 13px;
                    color: $color-slate-500;
                }
            }

            .modal-body {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .modal-empty {
                    padding: 24px;
                    text-align: center;
                    color: $color-slate-500;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;

                    .form-field {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;

                        &.form-full {
                            grid-column: 1 / -1;
                        }

                        .form-label {
                            font-size: 13px;
                            font-weight: 600;
                            color: $color-slate-700;
                        }
                    }
                }

                .form-error {
                    font-size: 13px;
                    color: $color-rose-600;
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;

                    .detail-item {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        padding: 12px;
                        border-radius: 12px;
                        background: $color-slate-50;
                        border: 1px solid $color-slate-100;

                        &.detail-full {
                            grid-column: 1 / -1;
                        }

                        .detail-label {
                            font-size: 12px;
                            color: $color-slate-500;
                        }

                        .detail-value {
                            font-size: 14px;
                            color: $color-slate-900;
                            font-weight: 600;
                        }
                    }
                }

                .list-table {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .list-row {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        gap: 12px;
                        padding: 12px;
                        border-radius: 12px;
                        border: 1px solid $color-slate-100;
                        background: $color-white;
                        font-size: 13px;
                        color: $color-slate-700;

                        &.list-head {
                            background: $color-slate-100;
                            font-weight: 600;
                            color: $color-slate-600;
                        }
                    }
                }

                .list-table-registration {
                    .list-row {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }

                .list-table-participation {
                    .list-row {
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                    }
                }
            }

            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
        }
    }
}

@media (min-width: 640px) {
    .activity-page {
        .filter-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .filter-right {
                width: auto;

                .search {
                    width: 260px;
                }
            }
        }
    }
}

@media (max-width: 1024px) {
    .activity-page {
        .activity-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
}

@media (max-width: 640px) {
    .activity-page {
        .activity-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
