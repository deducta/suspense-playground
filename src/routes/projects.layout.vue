<script setup lang="ts">
import { createSuspenseHandlers } from '@/store/navigation'

const suspenseHandlers = createSuspenseHandlers('projects-layout')
</script>

<template>
  <div class="projects-layout">
    <router-view v-slot="{ Component }">
      <Suspense suspensible v-on="suspenseHandlers">
        <component :is="Component" />
        <template #fallback>
          <div class="loading">Loading projects...</div>
        </template>
      </Suspense>
    </router-view>
  </div>
</template>

<style scoped>
.projects-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.loading {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}
</style>
