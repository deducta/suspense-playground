<script setup lang="ts">
import { computed, watch } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

import { fetchProject } from '@/services/api'

import { createSuspenseHandlers } from '@/store/navigation'

const suspenseHandlers = createSuspenseHandlers('project-layout')
const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

watch(projectId, (val) => console.log('[project.layout] projectId:', val), { immediate: true })

const { data: project, suspense } = useQuery({
  queryKey: computed(() => ['project', projectId.value]),
  queryFn: () => fetchProject(projectId.value),
})

await suspense()
</script>

<template>
  <div class="project-layout">
    <div class="project-header">
      <RouterLink to="/projects" class="back-link">← Back to Projects</RouterLink>
      <h2>{{ project?.name }}</h2>
    </div>
    <router-view v-slot="{ Component }">
      <Suspense suspensible v-on="suspenseHandlers">
        <component :is="Component" />
        <template #fallback>
          <div class="loading">Loading...</div>
        </template>
      </Suspense>
    </router-view>
  </div>
</template>

<style scoped>
.project-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.project-header {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.back-link {
  color: #6b7280;
  font-size: 0.875rem;
}
h2 {
  margin: 0.5rem 0;
}
.loading {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}
</style>
