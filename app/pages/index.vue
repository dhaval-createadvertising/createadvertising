<template>
  <div class="page-content">
    <!-- Header -->
    <header class="dashboard-header mb-md">
      <img src="/logo.svg" alt="CREATE" class="brand-logo" />
    </header>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card" id="stat-total-projects">
        <div class="stat-value">{{ totalProjects }}</div>
        <div class="stat-label">Projects</div>
      </div>
      <div class="stat-card" id="stat-in-progress">
        <div class="stat-value">{{ inProgressCount }}</div>
        <div class="stat-label">In Progress</div>
      </div>
      <div class="stat-card" id="stat-clients">
        <div class="stat-value">{{ state.clients.length }}</div>
        <div class="stat-label">Clients</div>
      </div>
      <div class="stat-card" id="stat-approval-rate">
        <div class="stat-value">{{ approvalRate }}%</div>
        <div class="stat-label">Approved</div>
      </div>
    </div>

    <!-- Urgent Projects -->
    <div v-if="urgentProjects.length" class="mb-md">
      <div class="section-header">
        <div>
          <h2 class="section-title" style="font-size: var(--font-size-lg);">
            ⚡ Urgent
          </h2>
          <p class="section-subtitle">Due within 48 hours</p>
        </div>
      </div>
      <div class="list-stack">
        <NuxtLink
          v-for="project in urgentProjects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="card"
          style="text-decoration: none;"
        >
          <div class="flex items-center justify-between">
            <span class="card-title" style="font-size: var(--font-size-md);">{{ project.project_name }}</span>
            <StatusBadge :status="project.status" />
          </div>
          <div class="card-meta">
            <span class="text-xs due-urgent">📅 {{ formatDate(project.due_date) }}</span>
            <span class="text-xs text-muted">{{ project.territory }}</span>
          </div>
          <ProjectProgress :project="project" />
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Projects -->
    <div>
      <div class="section-header">
        <div>
          <h2 class="section-title" style="font-size: var(--font-size-lg);">Recent Projects</h2>
          <p class="section-subtitle">{{ totalProjects }} total</p>
        </div>
        <NuxtLink to="/projects" class="btn btn-sm btn-secondary" id="view-all-projects">
          View All
        </NuxtLink>
      </div>
      <div class="list-stack">
        <NuxtLink
          v-for="project in recentProjects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="card"
          style="text-decoration: none;"
        >
          <div class="flex items-center justify-between">
            <span class="card-title" style="font-size: var(--font-size-md);">{{ project.project_name }}</span>
            <StatusBadge :status="project.status" />
          </div>
          <div class="card-meta">
            <span v-if="project.due_date" class="text-xs" :class="getDueClass(project.due_date)">
              📅 {{ formatDate(project.due_date) }}
            </span>
            <span v-if="project.territory" class="text-xs text-muted">🌍 {{ project.territory }}</span>
            <span v-if="getDistributorName(project.distributor_id)" class="text-xs text-muted">
              {{ getDistributorName(project.distributor_id) }}
            </span>
          </div>
          <ProjectProgress :project="project" />
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div v-if="totalProjects === 0" class="empty-state">
        <div class="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <p class="empty-state-title">No projects yet</p>
        <p class="empty-state-text">Create your first project to start tracking productions.</p>
        <NuxtLink to="/projects" class="btn btn-primary" id="create-first-project">
          + New Project
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { state } = useStore()

const totalProjects = computed(() => state.projects.length)
const inProgressCount = computed(() => state.projects.filter(p => p.status === 'In Progress').length)
const approvalRate = computed(() => {
  if (!state.projects.length) return 0
  const approved = state.projects.filter(p => p.status === 'Approved' || p.status === 'Completed').length
  return Math.round((approved / state.projects.length) * 100)
})

const recentProjects = computed(() =>
  [...state.projects]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
)

const urgentProjects = computed(() => {
  const now = Date.now()
  const threshold = 48 * 60 * 60 * 1000
  return state.projects.filter(p => {
    if (!p.due_date || p.status === 'Approved' || p.status === 'Completed') return false
    const due = new Date(p.due_date).getTime()
    return due - now < threshold && due - now > -threshold
  })
})

function getDistributorName(id: string) {
  return state.distributors.find(d => d.id === id)?.name ?? ''
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDueClass(dateStr: string) {
  const now = Date.now()
  const due = new Date(dateStr).getTime()
  const diff = due - now
  if (diff < 0) return 'due-urgent'
  if (diff < 48 * 60 * 60 * 1000) return 'due-urgent'
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'due-soon'
  return 'text-muted'
}
</script>
