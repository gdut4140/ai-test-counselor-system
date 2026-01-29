<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import PageHeader from '../../components/PageHeader.vue'
import { useMessageStore, type MessageType } from '../../stores/messages'
import { Send, Filter, RefreshCw } from 'lucide-vue-next'

const messageStore = useMessageStore()
const { items: messages, isLoading, error, totalCount } = storeToRefs(messageStore)

const composeType = ref<MessageType>('student')
const composeStudentIdNumber = ref('')
const composeClassId = ref('')
const composeContent = ref('')
const isSending = ref(false)
const sendError = ref('')
const sendSuccess = ref('')

const filterType = ref<MessageType | 'all'>('all')
const filterClassId = ref('')
const filterStudentIdNumber = ref('')
const sortField = ref<'sendTime' | 'classId' | 'studentIdNumber'>('sendTime')
const sortOrder = ref<'asc' | 'desc'>('desc')
const pageNum = ref(1)
const pageSize = ref(8)

const typeLabelMap: Record<MessageType, string> = {
    student: '学生消息',
    class: '班级消息'
}

const filteredMessages = computed(() => {
    const type = filterType.value
    const classId = filterClassId.value.trim()
    const studentId = filterStudentIdNumber.value.trim()

    const list = messages.value.filter(item => {
        if (type !== 'all' && item.messageType !== type) return false
        if (classId && item.classId !== classId) return false
        if (studentId && item.studentIdNumber !== studentId) return false
        return true
    })

    const sorted = [...list].sort((a, b) => {
        const field = sortField.value
        const order = sortOrder.value === 'asc' ? 1 : -1
        if (field === 'sendTime') {
            const aTime = new Date(a.sendTime.replace(' ', 'T')).getTime()
            const bTime = new Date(b.sendTime.replace(' ', 'T')).getTime()
            return (aTime - bTime) * order
        }
        const aValue = (a[field] ?? '').toString()
        const bValue = (b[field] ?? '').toString()
        return aValue.localeCompare(bValue) * order
    })

    return sorted
})

const totalFiltered = computed(() => filteredMessages.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)))

const pagedMessages = computed(() => {
    const start = (pageNum.value - 1) * pageSize.value
    return filteredMessages.value.slice(start, start + pageSize.value)
})

const contentCount = computed(() => composeContent.value.trim().length)

const resetPage = () => {
    pageNum.value = 1
}

watch([filterType, filterClassId, filterStudentIdNumber, sortField, sortOrder, pageSize], resetPage)

const handleSend = async () => {
    if (isSending.value) return
    sendError.value = ''
    sendSuccess.value = ''

    if (!composeContent.value.trim()) {
        sendError.value = '请填写消息内容。'
        return
    }

    if (composeType.value === 'student' && !composeStudentIdNumber.value.trim()) {
        sendError.value = '发送学生消息时需填写学号。'
        return
    }

    if (composeType.value === 'class' && !composeClassId.value.trim()) {
        sendError.value = '发送班级消息时需填写班级 ID。'
        return
    }

    isSending.value = true
    try {
        await messageStore.sendMessage({
            messageType: composeType.value,
            studentIdNumber: composeType.value === 'student' ? composeStudentIdNumber.value.trim() : null,
            classId: composeType.value === 'class' ? composeClassId.value.trim() : null,
            content: composeContent.value.trim()
        })
        composeContent.value = ''
        composeStudentIdNumber.value = ''
        composeClassId.value = ''
        sendSuccess.value = '消息发送成功。'
    } catch (err) {
        sendError.value = err instanceof Error ? err.message : '消息发送失败'
    } finally {
        isSending.value = false
    }
}

const resetFilters = () => {
    filterType.value = 'all'
    filterClassId.value = ''
    filterStudentIdNumber.value = ''
    sortField.value = 'sendTime'
    sortOrder.value = 'desc'
    pageNum.value = 1
}

const prevPage = () => {
    if (pageNum.value > 1) pageNum.value -= 1
}

const nextPage = () => {
    if (pageNum.value < totalPages.value) pageNum.value += 1
}
</script>

<template>
    <div class="page message-page">
        <PageHeader title="消息管理" subtitle="向学生或班级发布通知，并追踪已发送记录">
            <template #actions>
                <button class="btn btn-primary" @click="handleSend">
                    <Send class="icon icon-sm" />
                    发送消息
                </button>
            </template>
        </PageHeader>

        <div class="message-container">
            <section class="card message-compose" aria-label="发送消息">
                <div class="section-header">
                    <div>
                        <h3 class="section-title">发送消息</h3>
                        <p class="section-subtitle">支持单个学生或班级群发，确保通知及时触达。</p>
                    </div>
                    <div class="compose-meta">
                        <span class="meta-label">字数</span>
                        <span class="meta-value">{{ contentCount }}/300</span>
                    </div>
                </div>

                <div class="compose-body">
                    <div class="type-toggle" role="tablist" aria-label="选择消息类型">
                        <button class="type-toggle-btn" :class="composeType === 'student' ? 'is-active' : ''"
                            @click="composeType = 'student'" type="button">
                            学生消息
                        </button>
                        <button class="type-toggle-btn" :class="composeType === 'class' ? 'is-active' : ''"
                            @click="composeType = 'class'" type="button">
                            班级消息
                        </button>
                    </div>

                    <div class="compose-grid">
                        <div v-if="composeType === 'student'" class="form-field">
                            <label class="form-label">学生学号</label>
                            <input v-model="composeStudentIdNumber" type="text" class="input"
                                placeholder="如 20230101001" />
                        </div>
                        <div v-else class="form-field">
                            <label class="form-label">班级 ID</label>
                            <input v-model="composeClassId" type="text" class="input" placeholder="如 01" />
                        </div>

                        <div class="form-field form-full">
                            <label class="form-label">消息内容</label>
                            <textarea v-model="composeContent" rows="4" maxlength="300" class="input textarea"
                                placeholder="请输入需要通知的内容"></textarea>
                            <p class="form-hint">建议保持简洁，避免重复通知。</p>
                        </div>
                    </div>

                    <div class="compose-actions">
                        <button class="btn btn-outline" type="button" @click="messageStore.fetchSentMessages()">
                            <RefreshCw class="icon icon-sm" />
                            刷新记录
                        </button>
                        <button class="btn btn-primary" type="button" :disabled="isSending" @click="handleSend">
                            <span v-if="!isSending">立即发送</span>
                            <span v-else>发送中...</span>
                        </button>
                    </div>

                    <p v-if="sendError" class="form-error">{{ sendError }}</p>
                    <p v-if="sendSuccess" class="form-success">{{ sendSuccess }}</p>
                </div>
            </section>

            <section class="card message-history" aria-label="已发送消息">
                <div class="section-header">
                    <div>
                        <h3 class="section-title">已发送消息</h3>
                        <p class="section-subtitle">支持按类型、班级、学号筛选并排序查看。</p>
                    </div>
                    <div class="section-actions">
                        <button class="btn btn-outline btn-icon" type="button" @click="resetFilters">
                            <Filter class="icon icon-sm" />
                        </button>
                    </div>
                </div>

                <div class="filter-grid">
                    <div class="form-field">
                        <label class="form-label">消息类型</label>
                        <select v-model="filterType" class="select">
                            <option value="all">全部</option>
                            <option value="student">学生消息</option>
                            <option value="class">班级消息</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label class="form-label">班级 ID</label>
                        <input v-model="filterClassId" type="text" class="input" placeholder="如 01" />
                    </div>
                    <div class="form-field">
                        <label class="form-label">学生学号</label>
                        <input v-model="filterStudentIdNumber" type="text" class="input" placeholder="如 20230101001" />
                    </div>
                    <div class="form-field">
                        <label class="form-label">排序字段</label>
                        <select v-model="sortField" class="select">
                            <option value="sendTime">发送时间</option>
                            <option value="classId">班级 ID</option>
                            <option value="studentIdNumber">学生学号</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label class="form-label">排序顺序</label>
                        <select v-model="sortOrder" class="select">
                            <option value="desc">降序</option>
                            <option value="asc">升序</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label class="form-label">每页数量</label>
                        <select v-model.number="pageSize" class="select">
                            <option :value="6">6</option>
                            <option :value="8">8</option>
                            <option :value="10">10</option>
                        </select>
                    </div>
                </div>

                <div class="message-table card">
                    <div v-if="isLoading" class="empty-state">正在加载消息...</div>
                    <div v-else-if="error" class="empty-state">{{ error.message }}</div>
                    <div v-else-if="!pagedMessages.length" class="empty-state">暂无符合条件的消息记录</div>
                    <div v-else class="table-scroll">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">类型/对象</th>
                                    <th scope="col">消息内容</th>
                                    <th scope="col">发送时间</th>
                                    <th scope="col">发送人</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in pagedMessages" :key="item.messageId" class="table-row">
                                    <td>
                                        <div class="message-type">
                                            <span class="type-badge"
                                                :class="item.messageType === 'class' ? 'badge-class' : 'badge-student'">
                                                {{ typeLabelMap[item.messageType] }}
                                            </span>
                                            <span class="type-target">
                                                {{ item.messageType === 'class' ? (item.classId || '—') :
                                                (item.studentIdNumber
                                                || '—') }}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="message-content">{{ item.content }}</div>
                                    </td>
                                    <td>{{ item.sendTime }}</td>
                                    <td>{{ item.sender }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="table-footer">
                    <div class="pagination-text">
                        共 {{ totalFiltered }} 条记录 · 全部 {{ totalCount }} 条
                    </div>
                    <div class="pagination-nav">
                        <button class="pagination-link" :class="pageNum === 1 ? 'is-disabled' : ''"
                            :disabled="pageNum === 1" @click="prevPage">上一页</button>
                        <span class="pagination-page">{{ pageNum }}/{{ totalPages }}</span>
                        <button class="pagination-link" :class="pageNum === totalPages ? 'is-disabled' : ''"
                            :disabled="pageNum === totalPages" @click="nextPage">下一页</button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens' as *;

.message-page {
    .message-container {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: $space-lg;

        .message-compose,
        .message-history {
            padding: 24px;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
            margin-bottom: 20px;

            .section-title {
                font-size: 18px;
                font-weight: 700;
                color: $color-slate-900;
            }

            .section-subtitle {
                margin-top: 4px;
                color: $color-slate-500;
                font-size: 13px;
            }

            .compose-meta {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: $color-slate-100;
                padding: 6px 12px;
                border-radius: 999px;
                font-size: 12px;
                color: $color-slate-600;
            }
        }

        .type-toggle {
            display: inline-flex;
            gap: 6px;
            padding: 4px;
            border-radius: 999px;
            background: $color-slate-100;
            margin-bottom: 16px;

            .type-toggle-btn {
                border: none;
                background: transparent;
                padding: 8px 16px;
                border-radius: 999px;
                font-size: 13px;
                font-weight: 600;
                color: $color-slate-600;
                cursor: pointer;
                transition: background 200ms ease, color 200ms ease;

                &.is-active {
                    background: $color-white;
                    color: $color-slate-900;
                    box-shadow: $shadow-sm;
                }
            }
        }

        .compose-grid {
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

                .textarea {
                    resize: vertical;
                    min-height: 120px;
                }

                .form-hint {
                    font-size: 12px;
                    color: $color-slate-500;
                }
            }
        }

        .form-error {
            margin-top: 12px;
            color: $color-rose-600;
            font-size: 13px;
        }

        .form-success {
            margin-top: 12px;
            color: $color-emerald-600;
            font-size: 13px;
        }

        .compose-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-top: 16px;
            flex-wrap: wrap;
        }

        .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
        }

        .message-table {
            padding: 0;
            overflow: hidden;

            .table-scroll {
                overflow-x: auto;
            }

            .message-type {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .type-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 600;

                    &.badge-class {
                        background: rgba(124, 58, 237, 0.12);
                        color: $color-primary;
                    }

                    &.badge-student {
                        background: #fef3c7;
                        color: #92400e;
                    }
                }

                .type-target {
                    font-size: 13px;
                    color: $color-slate-600;
                }
            }

            .message-content {
                max-width: 320px;
                color: $color-slate-700;
            }

            .empty-state {
                padding: 32px;
                text-align: center;
                font-size: 14px;
                color: $color-slate-500;
            }
        }

        .table-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0 0;
            gap: 12px;
            flex-wrap: wrap;

            .pagination-text {
                font-size: 13px;
                color: $color-slate-500;
            }

            .pagination-nav {
                display: flex;
                align-items: center;
                gap: 10px;

                .pagination-link {
                    border: none;
                    background: $color-slate-100;
                    color: $color-slate-700;
                    padding: 6px 12px;
                    border-radius: 10px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background 200ms ease, color 200ms ease;

                    &:hover {
                        background: $color-slate-200;
                        color: $color-slate-900;
                    }

                    &.is-disabled {
                        cursor: not-allowed;
                        opacity: 0.6;
                    }
                }

                .pagination-page {
                    font-size: 13px;
                    color: $color-slate-600;
                }
            }
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    .message-page {
        * {
            transition: none !important;
        }
    }
}
</style>
