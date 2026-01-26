import { computed } from 'vue'

/**
 * Standardized status configuration for the application.
 * Follows the UI/UX Pro Max color system (Emerald, Amber, Rose, Slate).
 */
export function useStatusMap() {

    // Base configuration for different status types
    const config = {
        // General Active/Inactive
        active: { label: '正常', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconColor: 'text-emerald-600' },
        inactive: { label: '停用', color: 'bg-slate-50 text-slate-600 border-slate-200', iconColor: 'text-slate-400' },

        // Process States
        pending: { label: '待审批', color: 'bg-amber-50 text-amber-700 border-amber-200', iconColor: 'text-amber-600' },
        approved: { label: '已通过', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconColor: 'text-emerald-600' },
        rejected: { label: '已驳回', color: 'bg-rose-50 text-rose-700 border-rose-200', iconColor: 'text-rose-600' },

        // Time/Event States
        ongoing: { label: '进行中', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconColor: 'text-emerald-600' },
        registering: { label: '报名中', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', iconColor: 'text-indigo-600' },
        ended: { label: '已结束', color: 'bg-slate-50 text-slate-600 border-slate-200', iconColor: 'text-slate-400' },

        // Alert States
        warning: { label: '预警', color: 'bg-amber-50 text-amber-700 border-amber-200', iconColor: 'text-amber-600' },
        leave: { label: '请假', color: 'bg-blue-50 text-blue-700 border-blue-200', iconColor: 'text-blue-600' },
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
