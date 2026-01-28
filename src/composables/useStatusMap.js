import { computed } from 'vue'

/**
 * Standardized status configuration for the application.
 * Follows the UI/UX Pro Max color system (Emerald, Amber, Rose, Slate).
 */
export function useStatusMap() {

    // Base configuration for different status types
    const config = {
        // General Active/Inactive
        active: { label: '正常', color: 'status-badge--active' },
        inactive: { label: '停用', color: 'status-badge--inactive' },

        // Time/Event States
        ongoing: { label: '进行中', color: 'status-badge--ongoing' },
        registering: { label: '报名中', color: 'status-badge--registering' },
        ended: { label: '已结束', color: 'status-badge--ended' },

        // Alert States
        warning: { label: '预警', color: 'status-badge--warning' },
        leave: { label: '请假', color: 'status-badge--leave' },
    }

    /**
     * Get the tailwind classes for a given status key
     * @param {String} status 
     * @returns {String} Tailwind classes
     */
    const getStatusClass = (status) => {
        return config[status]?.color || config['inactive'].color
    }

    /**
     * Get the human readable label for a given status key
     * @param {String} status 
     * @returns {String} Label
     */
    const getStatusLabel = (status) => {
        return config[status]?.label || status
    }

    return {
        config,
        getStatusClass,
        getStatusLabel
    }
}
