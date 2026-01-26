import { ref, computed } from 'vue'

/**
 * A composable to handle basic tab switching logic.
 * @param {Array} tabs - Array of tab objects { id, name, count? }
 * @param {String} defaultTab - ID of the default active tab
 */
export function useTabs(initialTabs, defaultTab = 'all') {
    const activeTabId = ref(defaultTab)

    const setTab = (id) => {
        activeTabId.value = id
    }

    const currentTab = computed(() => {
        return initialTabs.find(t => t.id === activeTabId.value)
    })

    return {
        activeTabId,
        currentTab,
        setTab
    }
}
