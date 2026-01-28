import { ref, computed, type ComputedRef, type Ref } from 'vue'

export interface TabItemBase {
    id: string
    name: string
    count?: number | Ref<number>
}

/**
 * A composable to handle basic tab switching logic.
 * @param initialTabs - Array of tab objects { id, name, count? }
 * @param defaultTab - ID of the default active tab
 */
export function useTabs<T extends TabItemBase>(initialTabs: T[], defaultTab = 'all') {
    const activeTabId = ref(defaultTab)

    const setTab = (id: string) => {
        activeTabId.value = id
    }

    const currentTab: ComputedRef<T | undefined> = computed(() => {
        return initialTabs.find(t => t.id === activeTabId.value)
    })

    return {
        activeTabId,
        currentTab,
        setTab
    }
}
