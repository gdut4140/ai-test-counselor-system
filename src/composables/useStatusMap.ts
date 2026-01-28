export type StatusKey =
    | 'active'
    | 'inactive'
    | 'ongoing'
    | 'registering'
    | 'ended'
    | 'warning'
    | 'leave'

export interface StatusConfigItem {
    label: string
    color: string
}

export type StatusConfig = Record<StatusKey, StatusConfigItem>

/**
 * Standardized status configuration for the application.
 * Follows the UI/UX Pro Max color system (Emerald, Amber, Rose, Slate).
 */
export function useStatusMap() {
    const config: StatusConfig = {
        active: { label: '正常', color: 'status-active' },
        inactive: { label: '停用', color: 'status-inactive' },
        ongoing: { label: '进行中', color: 'status-ongoing' },
        registering: { label: '报名中', color: 'status-registering' },
        ended: { label: '已结束', color: 'status-ended' },
        warning: { label: '预警', color: 'status-warning' },
        leave: { label: '请假', color: 'status-leave' }
    }

    const getStatusClass = (status: string) => {
        return config[status as StatusKey]?.color || config.inactive.color
    }

    const getStatusLabel = (status: string) => {
        return config[status as StatusKey]?.label || status
    }

    return {
        config,
        getStatusClass,
        getStatusLabel
    }
}
