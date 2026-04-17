<template>
  <div class="page-content">
    <div class="section-header">
      <div>
        <h1 class="section-title">Projects</h1>
        <p class="section-subtitle">{{ filteredProjects.length }} project{{ filteredProjects.length !== 1 ? 's' : '' }}</p>
      </div>
      <button class="btn btn-primary btn-sm" id="add-project-btn" @click="showForm = true">
        + New
      </button>
    </div>

    <!-- Search -->
    <div class="search-bar" style="position: relative; top: 0;">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search by name, client, or territory..."
          id="project-search"
        />
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="filter-chips">
      <button
        v-for="filter in statusFilters"
        :key="filter"
        class="chip"
        :class="{ active: activeFilter === filter }"
        @click="activeFilter = activeFilter === filter ? null : filter"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Project List -->
    <div class="list-stack mt-md">
      <NuxtLink
        v-for="project in filteredProjects"
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
        </div>
        <ProjectProgress :project="project" />
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-if="filteredProjects.length === 0 && state.projects.length > 0" class="empty-state">
      <p class="empty-state-title">No matches</p>
      <p class="empty-state-text">Try changing your search or filter.</p>
    </div>

    <div v-if="state.projects.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      </div>
      <p class="empty-state-title">No projects yet</p>
      <p class="empty-state-text">Tap the + button to create your first project.</p>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingId ? 'Edit Project' : 'New Project' }}</h2>
            <button class="btn btn-ghost" @click="closeForm" id="close-project-form">✕</button>
          </div>
          <form @submit.prevent="saveProject">
            <div class="form-group">
              <label class="form-label">Project Name *</label>
              <input v-model="form.project_name" class="form-input" placeholder="e.g. Batman – LATAM Dub" required id="input-project-name" />
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select" id="input-project-status">
                <option>New</option>
                <option>In Progress</option>
                <option>Approved</option>
                <option>Completed</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Due Date</label>
              <input v-model="form.due_date" type="date" class="form-input" id="input-project-due" />
            </div>
            <div class="form-group">
              <label class="form-label">Territory</label>
              <input v-model="form.territory" class="form-input" placeholder="e.g. LATAM, UK, EMEA" id="input-project-territory" />
            </div>
            <div class="form-group">
              <label class="form-label">Distributor</label>
              <select v-model="form.distributor_id" class="form-select" id="input-project-distributor">
                <option value="">None</option>
                <option v-for="d in state.distributors" :key="d.id" :value="d.id">{{ d.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Owner</label>
              <input v-model="form.owner_id" class="form-input" placeholder="e.g. Dhaval Patel" id="input-project-owner" />
            </div>
            <div class="form-group">
              <label class="form-label">Language 1</label>
              <input v-model="form.language_1" class="form-input" placeholder="e.g. Spanish" id="input-project-lang1" />
            </div>
            <div class="form-group">
              <label class="form-label">Language 2</label>
              <input v-model="form.language_2" class="form-input" placeholder="e.g. Portuguese" id="input-project-lang2" />
            </div>
            <div class="form-group">
              <label class="form-label">Primary Contact Name</label>
              <input v-model="form.primary_contact_name" class="form-input" placeholder="Contact name" id="input-project-contact" />
            </div>
            <div class="form-group">
              <label class="form-label">Primary Contact Email</label>
              <input v-model="form.primary_contact_email" class="form-input" type="email" placeholder="email@example.com" id="input-project-email" />
            </div>
            <div class="form-group">
              <label class="form-label">CC Emails</label>
              <input v-model="form.cc_emails" class="form-input" placeholder="Comma-separated emails" id="input-project-cc" />
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea v-model="form.notes" class="form-textarea" placeholder="Any additional notes..." id="input-project-notes"></textarea>
            </div>
            <div class="flex gap-sm">
              <button type="submit" class="btn btn-primary flex-1" id="save-project-btn">
                {{ editingId ? 'Update' : 'Create' }} Project
              </button>
              <button v-if="editingId" type="button" class="btn btn-danger" @click="removeProject" id="delete-project-btn">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProjectStatus } from '~/types'

const { state, addProject, updateProject, deleteProject } = useStore()

const searchQuery = ref('')
const activeFilter = ref<ProjectStatus | null>(null)
const showForm = ref(false)
const editingId = ref<string | null>(null)

const statusFilters: ProjectStatus[] = ['New', 'In Progress', 'Approved', 'Completed']

const defaultForm = () => ({
  project_name: '',
  status: 'New' as ProjectStatus,
  due_date: '',
  territory: '',
  distributor_id: '',
  owner_id: '',
  language_1: '',
  language_2: '',
  primary_contact_name: '',
  primary_contact_email: '',
  cc_emails: '',
  notes: ''
})

const form = ref(defaultForm())

const filteredProjects = computed(() => {
  let result = [...state.projects]

  if (activeFilter.value) {
    result = result.filter(p => p.status === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.project_name.toLowerCase().includes(q) ||
      p.territory.toLowerCase().includes(q) ||
      p.primary_contact_name.toLowerCase().includes(q) ||
      state.distributors.find(d => d.id === p.distributor_id)?.name.toLowerCase().includes(q)
    )
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

function saveProject() {
  if (editingId.value) {
    updateProject(editingId.value, form.value)
  } else {
    addProject(form.value)
  }
  closeForm()
}

function removeProject() {
  if (editingId.value) {
    deleteProject(editingId.value)
    closeForm()
  }
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = defaultForm()
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDueClass(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff < 0) return 'due-urgent'
  if (diff < 48 * 60 * 60 * 1000) return 'due-urgent'
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'due-soon'
  return 'text-muted'
}
</script>
