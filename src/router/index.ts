import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ActivityList from '../views/activities/ActivityList.vue'
import StudentList from '../views/students/StudentList.vue'
import CourseList from '../views/courses/CourseList.vue'
import SystemSettings from '../views/system/SystemSettings.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        component: MainLayout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: Dashboard
            },
            {
                path: 'activities',
                name: 'activities',
                component: ActivityList
            },
            {
                path: 'students',
                name: 'students',
                component: StudentList
            },
            {
                path: 'courses',
                name: 'courses',
                component: CourseList
            },
            {
                path: 'system',
                name: 'system',
                component: SystemSettings
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
