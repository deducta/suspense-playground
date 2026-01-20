/**
 * Mock API with configurable delays to simulate async data fetching
 */

// Configurable delay (can be adjusted for testing)
// The 'projects' delay is key - it determines how long the old component
// stays visible when navigating from a workspace back to /projects
export const API_DELAY = {
  projects: 1500,
  project: 800,
  workspace: 1000,
  workspaceDetail: 500,
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface Project {
  id: string
  name: string
}

export interface Workspace {
  id: string
  name: string
}

export async function fetchProjects(): Promise<Project[]> {
  console.log('[api] fetchProjects() - starting')
  await delay(API_DELAY.projects)
  console.log('[api] fetchProjects() - resolved')
  return [
    { id: 'proj-1', name: 'Project Alpha' },
    { id: 'proj-2', name: 'Project Beta' },
  ]
}

export async function fetchProject(projectId: string): Promise<Project> {
  console.log(`[api] fetchProject(${projectId}) - starting`)
  await delay(API_DELAY.project)
  console.log(`[api] fetchProject(${projectId}) - resolved`)
  return { id: projectId, name: `Project ${projectId}` }
}

export async function fetchWorkspace(workspaceId: string): Promise<Workspace> {
  console.log(`[api] fetchWorkspace(${workspaceId}) - starting`)
  await delay(API_DELAY.workspace)
  console.log(`[api] fetchWorkspace(${workspaceId}) - resolved`)
  return { id: workspaceId, name: `Workspace ${workspaceId}` }
}

export async function fetchWorkspaceDetail(
  projectId: string,
  workspaceId: string,
): Promise<{ items: string[] }> {
  console.log(`[api] fetchWorkspaceDetail(${projectId}, ${workspaceId}) - starting`)
  await delay(API_DELAY.workspaceDetail)
  console.log(`[api] fetchWorkspaceDetail() - resolved`)
  return { items: ['Item 1', 'Item 2', 'Item 3'] }
}
