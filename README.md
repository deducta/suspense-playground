# Vue Suspense Playground

This app has a navigation bug. When navigating between certain routes that use `<Suspense>`, the UI breaks -- route params go `undefined`, `RouterLink` components crash, and navigation hangs.

Your task: **investigate the Suspense/Router desync and improve the navigation experience.**

## Requirements

We're going for a YT style navigation experience. The user is on a fully rendered functional page, click a link, a loading bar displays, they navigate to a fully rendered page. This means: no spinner, no skeleton content, all the async data is loaded before the navigation happens. In addition to the UX requirements here, our DX goal is: not having to check for `undefined` data, not needing conditionals to account for loading state, not having to catch setup/render errors on individual pages.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3001

## Reproducing the Bug

1. Navigate to a project: http://localhost:3001/projects/proj-1
2. Click **"Back to Projects"**
3. Watch what happens:
   - The breadcrumbs jump to `Home / Projects` immediately, even though the old project page is still visible
   - The header shows **"Project undefined"**
   - The workspace links crash with `Missing required param "projectId"`
   - Navigation hangs indefinitely (the loading bar never finishes)

The debug panel (bottom-right) shows real-time navigation state. The browser console logs the full error.

## What's Going On

When navigating from `/projects/proj-1` to `/projects`, Vue Router updates the URL and `route.params` immediately. But `<Suspense>` keeps the old component visible until the new page's async setup resolves. This creates a window where:

| What you'd expect             | What actually happens  |
| ----------------------------- | ---------------------- |
| Old component frozen in place | Old component re-renders reactively |
| `route.params.projectId` = `"proj-1"` | `route.params.projectId` = `undefined` |
| Navigation completes smoothly | `RouterLink` crashes, navigation hangs |

## Project Structure

```
src/
├── main.ts                          # App entry point
├── App.vue                          # Root component, router hooks, error handling
├── store/
│   └── navigation.ts                # Suspense + router state coordination
├── composables/
│   └── loadingIndicator.ts          # Loading bar logic
├── components/
│   ├── LoadingBar.vue               # Top-of-page progress bar
│   ├── LayoutLoading.vue            # Fullscreen loading spinner
│   └── DebugPanel.vue               # Real-time state debug overlay
├── services/
│   ├── api.ts                       # Mock API with configurable delays
│   └── query.ts                     # TanStack Query config (suspense mode)
├── router/
│   └── index.ts                     # Vue Router setup
└── routes/                          # File-based routing (unplugin-vue-router)
    ├── (home).page.vue              # /
    ├── projects.layout.vue          # /projects layout (Suspense boundary)
    └── projects/
        ├── (list).page.vue          # /projects
        ├── [projectId].layout.vue   # /projects/:projectId layout (Suspense boundary)
        └── [projectId]/
            ├── (overview).page.vue  # /projects/:projectId
            └── workspaces/
                └── [workspaceId].page.vue  # /projects/:projectId/workspaces/:workspaceId
```

## Reference Material

- [Vue Docs: Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [RFC Discussion: Suspense - some thoughts](https://github.com/vuejs/rfcs/discussions/746)
- [Vue Core: Suspense error handling](https://github.com/vuejs/core/issues/1347)
- [Vue Router: KeepAlive issues](https://github.com/vuejs/router/issues/626)
