import { createRouter, createWebHistory } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: autoRoutes,
})

export default router
