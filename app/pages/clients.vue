<template>
  <div class="page-content">
    <div class="section-header">
      <div>
        <h1 class="section-title">Clients</h1>
        <p class="section-subtitle">{{ state.clients.length }} client{{ state.clients.length !== 1 ? 's' : '' }}</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="openForm()" id="add-client-btn">+ New</button>
    </div>

    <!-- Search -->
    <div class="search-bar" style="position: relative; top: 0;">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input v-model="searchQuery" type="text" class="search-input" placeholder="Search clients..." id="client-search" />
      </div>
    </div>

    <!-- Client List -->
    <div class="list-stack mt-md">
      <div
        v-for="client in filteredClients"
        :key="client.id"
        class="card"
        @click="openForm(client)"
      >
        <div class="flex items-center justify-between">
          <span class="card-title" style="font-size: var(--font-size-md);">{{ client.name }}</span>
          <span class="text-xs text-muted">
            {{ getProjectCount(client.id) }} project{{ getProjectCount(client.id) !== 1 ? 's' : '' }}
          </span>
        </div>
        <p v-if="client.notes" class="text-sm text-muted mt-sm" style="line-height: 1.5;">{{ client.notes }}</p>
        <div class="card-meta" v-if="getDistributorCount(client.id) > 0">
          <span class="text-xs text-muted">
            🌍 {{ getDistributorCount(client.id) }} distributor{{ getDistributorCount(client.id) !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="filteredClients.length === 0" class="empty-state">
      <div class="empty-state-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      </div>
      <p class="empty-state-title">{{ state.clients.length === 0 ? 'No clients yet' : 'No matches' }}</p>
      <p class="empty-state-text">{{ state.clients.length === 0 ? 'Add your first client to get started.' : 'Try a different search term.' }}</p>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingId ? 'Edit Client' : 'New Client' }}</h2>
            <button class="btn btn-ghost" @click="closeForm">✕</button>
          </div>
          <form @submit.prevent="saveClient">
            <div class="form-group">
              <label class="form-label">Client Name *</label>
              <input v-model="form.name" class="form-input" required placeholder="e.g. Warner Bros." id="input-client-name" />
            </div>
            <div class="form-group">
              <label class="form-label">Notes</label>
              <textarea v-model="form.notes" class="form-textarea" placeholder="Notes about this client..." id="input-client-notes"></textarea>
            </div>
            <div class="flex gap-sm">
              <button type="submit" class="btn btn-primary flex-1" id="save-client-btn">
                {{ editingId ? 'Update' : 'Create' }}
              </button>
              <button v-if="editingId" type="button" class="btn btn-danger" @click="removeClient" id="delete-client-btn">
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
import type { Client } from '~/types'

const { state, addClient, updateClient, deleteClient } = useStore()

const searchQuery = ref('')
const showForm = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', notes: '' })

const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) return state.clients
  const q = searchQuery.value.toLowerCase()
  return state.clients.filter(c => c.name.toLowerCase().includes(q))
})

function getProjectCount(clientId: string) {
  const distIds = state.distributors.filter(d => d.client_id === clientId).map(d => d.id)
  return state.projects.filter(p => distIds.includes(p.distributor_id)).length
}

function getDistributorCount(clientId: string) {
  return state.distributors.filter(d => d.client_id === clientId).length
}

function openForm(client?: Client) {
  if (client) {
    editingId.value = client.id
    form.value = { name: client.name, notes: client.notes }
  } else {
    editingId.value = null
    form.value = { name: '', notes: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = { name: '', notes: '' }
}

function saveClient() {
  if (editingId.value) {
    updateClient(editingId.value, form.value)
  } else {
    addClient(form.value)
  }
  closeForm()
}

function removeClient() {
  if (editingId.value) {
    deleteClient(editingId.value)
    closeForm()
  }
}
</script>
