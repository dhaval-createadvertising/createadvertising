<template>
  <div class="page-content">
    <div class="section-header">
      <div>
        <h1 class="section-title">Distributors</h1>
        <p class="section-subtitle">{{ state.distributors.length }} distributor{{ state.distributors.length !== 1 ? 's' : '' }}</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="openForm()" id="add-distributor-btn">+ New</button>
    </div>

    <!-- Search -->
    <div class="search-bar" style="position: relative; top: 0;">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input v-model="searchQuery" type="text" class="search-input" placeholder="Search distributors..." id="distributor-search" />
      </div>
    </div>

    <!-- Distributor List -->
    <div class="list-stack mt-md">
      <div
        v-for="dist in filteredDistributors"
        :key="dist.id"
        class="card"
        @click="openForm(dist)"
      >
        <div class="flex items-center justify-between">
          <span class="card-title" style="font-size: var(--font-size-md);">{{ dist.name }}</span>
          <span class="text-xs text-muted">
            {{ getProjectCount(dist.id) }} project{{ getProjectCount(dist.id) !== 1 ? 's' : '' }}
          </span>
        </div>
        <div class="card-meta">
          <span v-if="dist.location" class="text-xs text-muted">📍 {{ dist.location }}</span>
          <span v-if="getClientName(dist.client_id)" class="text-xs text-muted">
            🏢 {{ getClientName(dist.client_id) }}
          </span>
        </div>
        <div class="card-meta" v-if="dist.phone || dist.website">
          <span v-if="dist.phone" class="text-xs text-muted">📞 {{ dist.phone }}</span>
        </div>
      </div>
    </div>

    <div v-if="filteredDistributors.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </div>
      <p class="empty-state-title">{{ state.distributors.length === 0 ? 'No distributors yet' : 'No matches' }}</p>
      <p class="empty-state-text">{{ state.distributors.length === 0 ? 'Add your first distributor.' : 'Try a different search term.' }}</p>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingId ? 'Edit Distributor' : 'New Distributor' }}</h2>
            <button class="btn btn-ghost" @click="closeForm">✕</button>
          </div>
          <form @submit.prevent="saveDistributor">
            <div class="form-group">
              <label class="form-label">Distributor Name *</label>
              <input v-model="form.name" class="form-input" required placeholder="e.g. LATAM Distribution Co." id="input-dist-name" />
            </div>
            <div class="form-group">
              <label class="form-label">Client</label>
              <select v-model="form.client_id" class="form-select" id="input-dist-client">
                <option value="">None</option>
                <option v-for="c in state.clients" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input v-model="form.location" class="form-input" placeholder="e.g. Mexico City, MX" id="input-dist-location" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input v-model="form.phone" class="form-input" type="tel" placeholder="+1 555 555 5555" id="input-dist-phone" />
            </div>
            <div class="form-group">
              <label class="form-label">Website</label>
              <input v-model="form.website" class="form-input" type="url" placeholder="https://..." id="input-dist-website" />
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea v-model="form.notes" class="form-textarea" placeholder="Notes..." id="input-dist-notes"></textarea>
            </div>
            <div class="flex gap-sm">
              <button type="submit" class="btn btn-primary flex-1" id="save-dist-btn">
                {{ editingId ? 'Update' : 'Create' }}
              </button>
              <button v-if="editingId" type="button" class="btn btn-danger" @click="removeDistributor" id="delete-dist-btn">
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
import type { Distributor } from '~/types'

const { state, addDistributor, updateDistributor, deleteDistributor } = useStore()

const searchQuery = ref('')
const showForm = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', location: '', phone: '', website: '', notes: '', client_id: '' })

const filteredDistributors = computed(() => {
  if (!searchQuery.value.trim()) return state.distributors
  const q = searchQuery.value.toLowerCase()
  return state.distributors.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.location.toLowerCase().includes(q)
  )
})

function getProjectCount(distId: string) {
  return state.projects.filter(p => p.distributor_id === distId).length
}

function getClientName(clientId: string) {
  return state.clients.find(c => c.id === clientId)?.name ?? ''
}

function openForm(dist?: Distributor) {
  if (dist) {
    editingId.value = dist.id
    form.value = {
      name: dist.name,
      location: dist.location,
      phone: dist.phone,
      website: dist.website,
      notes: dist.notes,
      client_id: dist.client_id
    }
  } else {
    editingId.value = null
    form.value = { name: '', location: '', phone: '', website: '', notes: '', client_id: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = { name: '', location: '', phone: '', website: '', notes: '', client_id: '' }
}

function saveDistributor() {
  if (editingId.value) {
    updateDistributor(editingId.value, form.value)
  } else {
    addDistributor(form.value)
  }
  closeForm()
}

function removeDistributor() {
  if (editingId.value) {
    deleteDistributor(editingId.value)
    closeForm()
  }
}
</script>
