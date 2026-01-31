import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type MessageType = 'student' | 'class'

export interface MessageItem {
    messageId: number
    messageType: MessageType
    classId?: string | null
    studentIdNumber?: string | null
    content: string
    sendTime: string
    sender: string
}

export interface MessageSendPayload {
    messageType?: MessageType
    classId?: string | null
    studentIdNumber?: string | null
    content: string
}

interface ApiResponse<T> {
    code: number
    msg: string
    data: T
}

export const useMessageStore = defineStore('messages', () => {
    const items = ref<MessageItem[]>([])
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    let initialized = false

    const totalCount = computed(() => items.value.length)

    async function fetchSentMessages() {
        isLoading.value = true
        error.value = null
        try {
            const { data: payload } = await axios.get<ApiResponse<MessageItem[]>>('/mock/api/admin/message/send/detail.json')
            if (payload.code !== 200) throw new Error(payload.msg || 'Failed to load messages')
            items.value = payload.data
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load messages')
        } finally {
            isLoading.value = false
        }
    }

    async function sendMessage(input: MessageSendPayload) {
        const { data: payload } = await axios.get<ApiResponse<null>>('/mock/api/admin/message/send.json')
        if (payload.code !== 200) throw new Error(payload.msg || 'Failed to send message')

        const now = new Date()
        const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

        const newMessage: MessageItem = {
            messageId: Date.now(),
            messageType: input.messageType ?? 'student',
            classId: input.classId ?? null,
            studentIdNumber: input.studentIdNumber ?? null,
            content: input.content,
            sendTime: formattedTime,
            sender: '王老师'
        }

        items.value.unshift(newMessage)
        return newMessage
    }

    function init() {
        if (initialized) return
        initialized = true
        fetchSentMessages()
    }

    init()

    return {
        items,
        isLoading,
        error,
        totalCount,
        fetchSentMessages,
        sendMessage,
        init
    }
})
