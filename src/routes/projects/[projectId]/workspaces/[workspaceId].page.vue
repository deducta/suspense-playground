<script setup lang="ts">
import { computed } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
const workspaceId = computed(() => route.params.workspaceId as string)

const { data: workspace, suspense } = useQuery({
  queryKey: computed(() => ['workspace', projectId.value, workspaceId.value]),
  queryFn: async () => {
    console.log(`[workspace] Loading workspace ${workspaceId.value}...`)
    await new Promise((r) => setTimeout(r, 800))
    return {
      id: workspaceId.value,
      name: `Workspace ${workspaceId.value}`,
      items: ['Item 1', 'Item 2', 'Item 3'],
    }
  },
})

await suspense()
</script>

<template>
  <div class="workspace-page">
    <RouterLink
      :to="{ name: '/projects/[projectId]/(overview)', params: { projectId } }"
      class="back-link"
    >
      &larr; Back to Project
    </RouterLink>

    <h3>{{ workspace?.name }}</h3>

    <div class="info-card">
      <p>
        Project ID: <code>{{ projectId }}</code>
      </p>
      <p>
        Workspace ID: <code>{{ workspaceId }}</code>
      </p>
    </div>

    <div class="items-card">
      <h4>Items</h4>
      <ul>
        <li v-for="item in workspace?.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.workspace-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.back-link {
  color: #6b7280;
  font-size: 0.875rem;
}
h3 {
  margin: 0;
}
.info-card,
.items-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
p {
  margin: 0.25rem 0;
  color: #374151;
}
code {
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}
ul {
  margin: 0;
  padding-left: 1.5rem;
}
li {
  margin: 0.25rem 0;
}
</style>
