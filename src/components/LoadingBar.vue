<script setup lang="ts">
import { useLoadingIndicator } from '@/composables/loadingIndicator'

const { progress, isLoading, error } = useLoadingIndicator()
</script>

<template>
  <div
    class="loading-bar"
    :class="{
      'loading-bar--visible': isLoading,
      'loading-bar--error': error,
    }"
    :style="{ transform: `scaleX(${progress / 100})` }"
  />
</template>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transform-origin: left;
  transform: scaleX(0);
  transition:
    transform 0.1s ease-out,
    opacity 0.3s ease;
  opacity: 0;
  z-index: 9999;
}

.loading-bar--visible {
  opacity: 1;
}

.loading-bar--error {
  background: linear-gradient(90deg, #ef4444, #f97316);
}
</style>
