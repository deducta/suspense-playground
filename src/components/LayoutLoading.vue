<script setup lang="ts">
// Simple fullscreen loading spinner used as Suspense fallback
</script>

<template>
  <div class="layout-loading">
    <div class="spinner" />
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.layout-loading {
  display: grid;
  place-items: center;
  min-height: 100vh;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

p {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
