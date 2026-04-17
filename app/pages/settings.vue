<template>
  <div class="page-content">
    <h1 class="section-title" style="margin-bottom: var(--space-xl);">Settings</h1>

    <!-- App Info -->
    <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
      <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        Application
      </h3>
      <div class="detail-row">
        <span class="detail-label">App Name</span>
        <span class="detail-value">CREATE</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Version</span>
        <span class="detail-value">1.0.0</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Storage</span>
        <span class="detail-value">Local Storage</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Data Size</span>
        <span class="detail-value">{{ dataSize }}</span>
      </div>
    </div>

    <!-- Theme Selection -->
    <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
      <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        Appearance
      </h3>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Dark Mode</span>
        <label class="toggle-switch">
          <input type="checkbox" :checked="theme === 'dark'" @change="toggleTheme" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- Data Stats -->
    <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
      <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        Data Summary
      </h3>
      <div class="detail-row">
        <span class="detail-label">Clients</span>
        <span class="detail-value">{{ state.clients.length }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Distributors</span>
        <span class="detail-value">{{ state.distributors.length }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Projects</span>
        <span class="detail-value">{{ state.projects.length }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Project Files</span>
        <span class="detail-value">{{ state.projectFiles.length }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Localization Entries</span>
        <span class="detail-value">{{ state.localization.length }}</span>
      </div>
    </div>

    <!-- Portals -->
    <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
      <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        Portals
      </h3>
      <p class="text-sm text-muted mb-md">External-facing views for distributors.</p>
      <NuxtLink to="/distributor-portal" class="btn btn-secondary btn-block" id="open-distributor-portal">
        Open LATAM Distribution Portal
      </NuxtLink>
    </div>

    <!-- Actions -->
    <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
      <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        Data Management
      </h3>
      <div class="flex flex-col gap-sm">
        <button class="btn btn-secondary btn-block" @click="exportData" id="export-data-btn">
          📦 Export Data (JSON)
        </button>
        <label class="btn btn-secondary btn-block" style="cursor: pointer;" id="import-data-btn">
          📥 Import Data (JSON)
          <input type="file" accept=".json" @change="importData" style="display: none;" />
        </label>
        <button class="btn btn-secondary btn-block" @click="reseedData" id="reseed-data-btn">
          🌱 Reset to Demo Data
        </button>
        <button class="btn btn-danger btn-block" @click="clearAllData" id="clear-data-btn">
          🗑️ Clear All Data
        </button>
      </div>
    </div>

    <!-- About -->
    <div class="card" style="cursor: default;">
      <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        About
      </h3>
      <p class="text-sm text-muted" style="line-height: 1.7;">
        CREATE is a mobile-first Production Tracking Portal built to replace the Coda-based workflow
        with a faster, more intuitive interface. All data is stored locally in your browser.
      </p>
      <p class="text-sm text-muted mt-md" style="line-height: 1.7;">
        Built with Nuxt 4, Vue 3, and localStorage. Ready for Supabase integration when you are.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { state, seedDemoData } = useStore()
const { theme, toggleTheme } = useTheme()

const dataSize = computed(() => {
  if (import.meta.server) return '0 B'
  try {
    const raw = localStorage.getItem('createAdAgency_store') ?? ''
    const bytes = new Blob([raw]).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } catch {
    return 'Unknown'
  }
})

function exportData() {
  const data = localStorage.getItem('createAdAgency_store') ?? '{}'
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `create-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      localStorage.setItem('createAdAgency_store', JSON.stringify(data))
      window.location.reload()
    } catch {
      alert('Invalid JSON file.')
    }
  }
  reader.readAsText(file)
}

function reseedData() {
  if (confirm('This will clear all current data and load demo data. Continue?')) {
    localStorage.removeItem('createAdAgency_store')
    window.location.reload()
  }
}

function clearAllData() {
  if (confirm('This will permanently delete ALL data. Are you sure?')) {
    localStorage.removeItem('createAdAgency_store')
    // Clear the reactive state
    state.clients = []
    state.distributors = []
    state.projects = []
    state.projectFiles = []
    state.localization = []
  }
}
</script>

<style scoped>
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border);
}
.detail-row:last-child {
  border-bottom: none;
}
.detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.detail-value {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>
