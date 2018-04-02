import Vue from 'vue'
import Router from 'vue-router'
import projects from '@/components/projects'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'projects',
      component: projects
    }
  ]
})
