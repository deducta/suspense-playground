# Vue Suspense Playground

A minimal reproduction environment for debugging Vue Suspense navigation issues, specifically the problem where route params become `undefined` while the old page is still visible during navigation transitions.

## The Problem

When using Vue Suspense with Vue Router, there's a timing issue during navigation:

1. User navigates from `/projects/proj-1/workspaces/ws-1` to `/projects`
2. Vue Router **immediately** updates the URL and `route.params`
3. But Suspense keeps the old component (workspace layout) **visible** until the new page resolves
4. The old component now sees `route.params.projectId === undefined`
5. Any `RouterLink` or code that depends on `projectId` will crash

This creates a mismatch:

| Aspect                       | Value                  |
| ---------------------------- | ---------------------- |
| **URL**                      | `/projects` (new dest) |
| **Visible Component**        | Workspace layout (old) |
| **`route.params.projectId`** | `undefined`            |

## Quick Start

```bash
cd suspense-playground
npm install
npm run dev
```

Open http://localhost:3001

## Reproducing the Bug

**Quickest way:**

1. Go directly to a project: http://localhost:3001/projects/proj-1
2. Click **"← Back to Projects"**
3. **Watch what happens:**
   - The page shows **"Project undefined"**
   - The RouterLinks to workspaces crash with `Missing required param "projectId"`
   - Navigation hangs indefinitely (loading bar stays visible)

**What's happening:**

- The URL changes to `/projects` immediately
- `route.params` becomes `{}` (no `projectId`)
- But Suspense keeps the old project layout visible while loading the projects list
- The old component re-renders with `projectId = undefined`
- RouterLinks try to resolve routes with undefined params → **CRASH**

Open the browser console to see the error and the Debug Panel to watch `route.params` become empty.

## Project Structure

```
suspense-playground/
├── src/
│   ├── main.ts                 # Entry point
│   ├── App.vue                 # Root suspense, router hooks
│   ├── store/
│   │   └── navigation.ts       # Suspense state management (from main app)
│   ├── composables/
│   │   └── loadingIndicator.ts # Loading bar logic (from Nuxt)
│   ├── components/
│   │   ├── LoadingBar.vue      # Top loading bar
│   │   ├── LayoutLoading.vue   # Fullscreen spinner
│   │   └── DebugPanel.vue      # Real-time state viewer
│   ├── services/
│   │   ├── api.ts              # Mock API with delays
│   │   └── query.ts            # TanStack Query config
│   ├── router/
│   │   └── index.ts            # Vue Router setup
│   └── routes/
│       ├── (home).page.vue     # Home page
│       ├── projects.layout.vue # Projects section layout
│       └── projects/
│           ├── (list).page.vue           # Project list
│           ├── [projectId].layout.vue    # ⚠️ Project detail layout 
│           └── [projectId]/
│               ├── (overview).page.vue   # Project overview
│               └── workspaces/
│                   ├── [workspaceId].layout.vue  
│                   └── [workspaceId]/
│                       ├── (detail).page.vue     # ⚠️ Workspace detail
│                       └── settings.page.vue     # Workspace settings
```

Files marked with ⚠️ are where the bug manifests.

## Key Files

### `src/store/navigation.ts`

Central suspense state coordination:

- `suspenseStateMap` - Tracks state of all Suspense boundaries
- `routerState` - Tracks Vue Router navigation state
- `navigationState` - Combined state (computed)
- `createSuspenseHandlers()` - Factory for Suspense event handlers

### `src/App.vue`

Root component with:

- Router hooks (`beforeEach`/`afterEach`) that update `routerState`
- Root `<Suspense>` boundary
- Error capturing via `onErrorCaptured`
- Loading bar integration

### `src/routes/projects/[projectId].layout.vue`

The problematic layout where the bug is most visible:

- Uses `computed(() => route.params.projectId)` for reactive param access
- Has a nested `<router-view>` that renders `(overview).page.vue`
- The overview page has RouterLinks to workspaces that depend on `projectId`
- When navigating away, `projectId` becomes `undefined` and these links crash

### `src/routes/projects/[projectId]/workspaces/[workspaceId].layout.vue`

Another problematic layout (deeper nesting):

- Uses `computed(() => route.params.projectId)` and `computed(() => route.params.workspaceId)`
- Has `RouterLink` components that depend on these params
- These links crash when navigating away

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.vue                               │
│  Router: beforeEach -> routerState = 'pending'              │
│          afterEach  -> nextTick -> routerState = 'resolve'  │
│                            │                                 │
│  <Suspense v-on="suspenseHandlers('App')">                  │
│    └── <router-view>                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  projects.layout.vue                                         │
│  <Suspense suspensible v-on="suspenseHandlers('projects')>  │
│    └── <router-view>                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  [projectId].layout.vue                        ← BUG HERE   │
│  const projectId = computed(() => route.params.projectId)   │
│  await projectQuery.suspense()                              │
│  <h2>{{ project?.name }}</h2>  ← Shows "Project undefined"  │
│  <router-view> → (overview).page.vue                        │
│    └── <RouterLink :params="{ projectId }">    ← CRASH      │
└─────────────────────────────────────────────────────────────┘
```

## Related Issues & RFCs

- [RFC Discussion: Suspense - some thoughts](https://github.com/vuejs/rfcs/discussions/746)
- [Vue Core: Suspense error handling](https://github.com/vuejs/core/issues/1347)
- [Vue Router: KeepAlive issues](https://github.com/vuejs/router/issues/626)
- [Vue Docs: Suspense](https://vuejs.org/guide/built-ins/suspense.html)
