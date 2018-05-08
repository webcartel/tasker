import Vue from 'vue'
import Router from 'vue-router'
import projects from '@/components/projects'
import tasks from '@/components/tasks'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'projects',
            component: projects
        },
        {
            path: '/tasks-of-project/:project_id',
            name: 'tasksOfProject',
            component: tasks
        },
        {
            path: '/tasks-by-id/:task_id',
            name: 'tasksById',
            component: tasks
        },
    ]
})
