<script setup lang="ts">
// Home page - simple navigation hub
</script>

<template>
  <div class="home">
    <h1>Vue Suspense Playground</h1>

    <p class="intro">
      This playground demonstrates issues with Vue Suspense during navigation, specifically how
      route params become undefined while the old page is still rendered.
    </p>

    <div class="card">
      <h2>Reproduce the Bug</h2>
      <ol>
        <li>
          Navigate to a project:
          <RouterLink to="/projects/proj-1">Project Alpha</RouterLink>
        </li>
        <li>
          <strong>Click "Back to Projects"</strong> (or "Projects" in the navbar)
        </li>
        <li>
          Watch what happens - the page shows <em>"Project undefined"</em> and the RouterLinks to
          workspaces crash with "Missing required param projectId"
        </li>
        <li>The navigation hangs indefinitely because the error breaks Suspense resolution</li>
      </ol>
    </div>

    <div class="card">
      <h2>Why This Happens</h2>
      <p>When navigating from <code>/projects/proj-1</code> to <code>/projects</code>:</p>
      <ol>
        <li>Vue Router immediately updates the URL and <code>route.params</code> becomes <code>{}</code></li>
        <li>But Suspense keeps the old component visible while the new page loads</li>
        <li>The old component re-renders with <code>projectId = undefined</code></li>
        <li>RouterLinks try to resolve routes with undefined params and crash</li>
      </ol>
    </div>

    <div class="card">
      <h2>Recommended reading</h2>
      <ul>
        <li><a href="https://github.com/vuejs/rfcs/discussions/746" target="_blank" rel="noopener noreferrer">Open conversation around the future of suspense</a></li>
        <li>
          <a href="https://github.com/vuejs/core/issues/1347" target="_blank" rel="noopener noreferrer">Lack of error handling with suspense. </a>
        </li>
        <li>
          <a href="https://vuejs.org/guide/built-ins/suspense" target="_blank" rel="noopener noreferrer">Vue Suspense docs</a>
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>Debug Panel</h2>
      <p>
        The debug panel in the bottom-right corner shows real-time state of the navigation system:
      </p>
      <ul>
        <li><strong>routerState</strong> - Router's navigation state</li>
        <li><strong>navigationState</strong> - Combined router + suspense state</li>
        <li><strong>route.params</strong> - Current route parameters</li>
        <li><strong>Suspense Boundaries</strong> - State of each registered Suspense</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}

.intro {
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

ol,
ul {
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

li strong {
  color: #111827;
}

li em {
  color: #ef4444;
  font-style: normal;
  font-weight: 500;
}
</style>
