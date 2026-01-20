<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

import { fetchProjects } from '@/services/api'

const { data: projects, suspense } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
})

await suspense()
</script>

<template>
  <div class="projects-list">
    <h1>Projects</h1>
    <p>Select a project to view its workspaces.</p>
    <div class="project-cards">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="{ name: '/projects/[projectId]/(overview)', params: { projectId: project.id } }"
        class="project-card"
      >
        {{ project.name }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.projects-list {
  max-width: 600px;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
p {
  color: #6b7280;
  margin-bottom: 1rem;
}
.project-cards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.project-card {
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
}
.project-card:hover {
  border-color: #3b82f6;
}
</style>
