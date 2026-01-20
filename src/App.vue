<script setup lang="ts">
import { nextTick, onErrorCaptured, watch } from 'vue'

import { useRouter } from 'vue-router'

import DebugPanel from '@/components/DebugPanel.vue'
import LayoutLoading from '@/components/LayoutLoading.vue'
import LoadingBar from '@/components/LoadingBar.vue'

import { useLoadingIndicator } from '@/composables/loadingIndicator'

import {
  createSuspenseHandlers,
  isNavigating,
  routerState,
  setSuspenseError,
} from '@/store/navigation'

const router = useRouter()

const suspenseHandlers = createSuspenseHandlers('App')

const { start, finish } = useLoadingIndicator()

// Watch navigation state to control loading bar
watch(
  isNavigating,
  (navigating) => {
    console.log('[App] isNavigating:', navigating)
    if (navigating) start()
    else finish()
  },
  { immediate: true },
)

// Hook into router state
router.beforeEach((to, from, next) => {
  console.log(`[router] beforeEach: ${from.fullPath} -> ${to.fullPath}`)
  routerState.value = 'pending'
  next()
})

router.afterEach((to, from) => {
  console.log(`[router] afterEach: ${from.fullPath} -> ${to.fullPath}`)
  // nextTick ensures the new component has mounted before we mark router as resolved
  nextTick(() => {
    routerState.value = 'resolve'
  })
})

// Capture errors from async setup functions
onErrorCaptured((err, _instance, info) => {
  console.error('[App] Error captured:', err, 'Info:', info)
  if (info !== 'setup function') return true
  setSuspenseError(err as Error)
  return false // Stop propagation
})
</script>

<template>
  <LoadingBar />

  <nav class="navbar">
    <div class="navbar-brand">
      <RouterLink to="/">Suspense Playground</RouterLink>
    </div>
    <div class="navbar-links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/projects">Projects</RouterLink>
    </div>
  </nav>

  <main>
    <router-view v-slot="{ Component }">
        <Suspense v-on="suspenseHandlers">
          <component :is="Component" />

          <template #fallback>
            <LayoutLoading />
          </template>
        </Suspense>
    </router-view>
  </main>

  <DebugPanel />
</template>

<style>
/* Global styles */
a {
  color: #3b82f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.navbar-brand a {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.navbar-brand a:hover {
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.navbar-links a {
  color: #6b7280;
  font-weight: 500;
}

.navbar-links a:hover {
  color: #111827;
  text-decoration: none;
}

.navbar-links a.router-link-active {
  color: #3b82f6;
}

/* Main content */
main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
