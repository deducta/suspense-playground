<script setup lang="ts">
import { computed } from 'vue'

import { useRoute } from 'vue-router'

import { isNavigating, navigationState, routerState, suspenseStateMap } from '@/store/navigation'

const route = useRoute()

const suspenseEntries = computed(() => {
  return Array.from(suspenseStateMap.value.entries())
})

const routeParams = computed(() => {
  return JSON.stringify(route.params, null, 2)
})
</script>

<template>
  <div class="debug-panel">
    <h3>Debug Panel</h3>

    <div class="debug-section">
      <h4>Navigation</h4>
      <div class="debug-row">
        <span class="label">URL:</span>
        <code>{{ route.fullPath }}</code>
      </div>
      <div class="debug-row">
        <span class="label">isNavigating:</span>
        <span :class="['badge', isNavigating ? 'badge--warning' : 'badge--success']">
          {{ isNavigating }}
        </span>
      </div>
      <div class="debug-row">
        <span class="label">navigationState:</span>
        <span
          :class="[
            'badge',
            navigationState === 'resolve'
              ? 'badge--success'
              : navigationState === 'pending'
                ? 'badge--warning'
                : 'badge--info',
          ]"
        >
          {{ navigationState }}
        </span>
      </div>
    </div>

    <div class="debug-section">
      <h4>Router</h4>
      <div class="debug-row">
        <span class="label">routerState:</span>
        <span :class="['badge', routerState === 'resolve' ? 'badge--success' : 'badge--warning']">
          {{ routerState }}
        </span>
      </div>
      <div class="debug-row">
        <span class="label">route.params:</span>
        <pre>{{ routeParams }}</pre>
      </div>
    </div>

    <div class="debug-section">
      <h4>Suspense Boundaries</h4>
      <div v-if="suspenseEntries.length === 0" class="debug-row">
        <span class="text-muted">No suspense boundaries registered</span>
      </div>
      <div v-for="[key, state] in suspenseEntries" :key="key" class="debug-row">
        <span class="label">{{ key }}:</span>
        <span
          :class="[
            'badge',
            state === 'resolve'
              ? 'badge--success'
              : state === 'pending'
                ? 'badge--warning'
                : 'badge--info',
          ]"
        >
          {{ state }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  font-size: 0.75rem;
  z-index: 9998;
}

h3 {
  margin: 0;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 600;
}

.debug-section {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.debug-section:last-child {
  border-bottom: none;
}

h4 {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.debug-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.debug-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #374151;
  min-width: 100px;
}

code {
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  word-break: break-all;
}

pre {
  margin: 0;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.625rem;
  white-space: pre-wrap;
  word-break: break-all;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge--success {
  background: #d1fae5;
  color: #065f46;
}

.badge--warning {
  background: #fef3c7;
  color: #92400e;
}

.badge--info {
  background: #dbeafe;
  color: #1e40af;
}

.text-muted {
  color: #9ca3af;
  font-style: italic;
}
</style>
