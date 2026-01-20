<script setup lang="ts">
import { computed } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
</script>

<template>
  <div class="overview">
    <h3>Project Overview</h3>
    <p>
      Project ID: <code>{{ projectId }}</code>
    </p>
    <div class="workspaces">
      <h4>Workspaces</h4>
      <!-- These links are what's going to make the navigation crash -->
      <RouterLink
        v-for="ws in ['ws-1', 'ws-2']"
        :key="ws"
        :to="{
          name: '/projects/[projectId]/workspaces/[workspaceId]',
          params: { projectId, workspaceId: ws },
        }"
        class="workspace-link"
      >
        Workspace {{ ws }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.overview {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
h3 {
  margin: 0 0 1rem;
}
code {
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}
.workspaces {
  margin-top: 1rem;
}
h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
.workspace-link {
  display: block;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f9fafb;
  border-radius: 4px;
}
</style>
