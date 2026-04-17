<template>
  <div class="page-content">
    <header class="dashboard-header">
      <div class="flex items-center justify-between">
        <div>
          <img src="/logo.svg" alt="CREATE" class="brand-logo" style="margin-bottom: var(--space-xs);" />
          <h1 class="page-title" style="font-size: var(--font-size-md); opacity: 0.7;">Distributor Portal</h1>
          <p class="page-subtitle"><strong>LATAM Distribution Co.</strong></p>
        </div>
        <div v-if="latamProjects.length > 0" class="flex gap-sm">
          <button @click="$router.push('/settings')" class="btn btn-sm btn-ghost" title="Exit">✕ Exit</button>
          <button 
            @click="viewMode = 'list'" 
            class="btn btn-sm" 
            :class="viewMode === 'list' ? 'btn-primary' : 'btn-secondary'"
          >
            List
          </button>
          <button 
            @click="viewMode = 'focus'" 
            class="btn btn-sm" 
            :class="viewMode === 'focus' ? 'btn-primary' : 'btn-secondary'"
          >
            Focus
          </button>
        </div>
      </div>
    </header>

    <div v-if="latamProjects.length === 0" class="empty-state">
      <p class="empty-state-title">No active orders</p>
      <p class="empty-state-text">You don't have any projects assigned yet.</p>
    </div>

    <div v-else>
      <!-- Project Selector if multiple -->
      <div v-if="latamProjects.length > 1" class="mb-lg">
        <label class="form-label" style="font-size: 10px;">Select Project</label>
        <select v-model="selectedProjectId" class="form-select">
          <option v-for="p in latamProjects" :key="p.id" :value="p.id">{{ p.project_name }}</option>
        </select>
      </div>

      <!-- ─── LIST VIEW ────────────────────────────────────────── -->
      <div v-if="viewMode === 'list'" class="list-stack">
        <div v-if="selectedProject" class="card" style="cursor: default;">
          <h2 class="section-title" style="font-size: var(--font-size-md); margin-bottom: var(--space-md);">
            {{ selectedProject.project_name }}
          </h2>
          
          <div v-if="currentEntries.length === 0" class="text-sm text-muted text-center p-xl">
            No entries to translate.
          </div>

          <div v-for="entry in currentEntries" :key="entry.id" class="loc-card" style="border-left-width: 2px;">
            <div class="flex gap-sm mb-xs">
              <span class="loc-timecode" style="font-size: 10px; padding: 2px 6px;">{{ entry.timecode_in }}</span>
            </div>
            <p class="text-sm mb-sm" style="font-weight: 600;">{{ entry.english_dialogue }}</p>
            <div class="flex flex-col gap-sm">
              <textarea
                v-model="entry.language_1_translation"
                class="form-input text-sm"
                rows="1"
                :placeholder="selectedProject.language_1 + '...'"
                @blur="updateLocalizationEntry(entry.id, entry)"
                style="background: var(--color-bg-elevated); min-height: 44px;"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── FOCUS MODE ───────────────────────────────────────── -->
      <div v-else-if="viewMode === 'focus' && selectedProject" class="focus-mode-container">
        <div class="progress-bar-wrapper mb-lg">
          <div class="flex justify-between text-xs mb-xs">
            <span>Entry {{ focusIndex + 1 }} of {{ currentEntries.length }}</span>
            <span>{{ Math.round(((focusIndex + 1) / currentEntries.length) * 100) }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: ((focusIndex + 1) / currentEntries.length) * 100 + '%' }"></div>
          </div>
        </div>

        <div v-if="currentEntries[focusIndex]" class="focus-card card">
          <div class="mb-lg">
            <span class="loc-timecode">{{ currentEntries[focusIndex].timecode_in }} - {{ currentEntries[focusIndex].timecode_out }}</span>
          </div>
          
          <div class="source-section mb-xl">
            <label class="form-label" style="color: var(--color-text-muted);">English Source</label>
            <p style="font-size: var(--font-size-lg); font-weight: 500; line-height: 1.4;">
              {{ currentEntries[focusIndex].english_dialogue || '(No Dialogue)' }}
            </p>
            <p v-if="currentEntries[focusIndex].english_on_screen_text" class="text-sm text-warning italic mt-sm">
              On-screen: {{ currentEntries[focusIndex].english_on_screen_text }}
            </p>
          </div>

          <div class="translation-section flex flex-col gap-lg">
            <div>
              <label class="form-label" style="color: var(--color-accent);">{{ selectedProject.language_1 }} Translation</label>
              <textarea
                v-model="currentEntries[focusIndex].language_1_translation"
                class="form-input focus-textarea"
                rows="3"
                placeholder="Type translation here..."
                @blur="updateLocalizationEntry(currentEntries[focusIndex].id, currentEntries[focusIndex])"
                ref="focusInput"
              ></textarea>
            </div>
            <div v-if="selectedProject.language_2">
              <label class="form-label" style="color: var(--color-accent);">{{ selectedProject.language_2 }} Translation</label>
              <textarea
                v-model="currentEntries[focusIndex].language_2_translation"
                class="form-input focus-textarea"
                rows="3"
                placeholder="Type translation here..."
                @blur="updateLocalizationEntry(currentEntries[focusIndex].id, currentEntries[focusIndex])"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Sticky Navigation -->
        <div class="focus-nav">
          <button 
            class="btn btn-secondary flex-1" 
            @click="focusIndex > 0 ? focusIndex-- : null"
            :disabled="focusIndex === 0"
          >
            ← Previous
          </button>
          <button 
            class="btn btn-primary flex-1" 
            @click="focusIndex < currentEntries.length - 1 ? focusIndex++ : null"
            :disabled="focusIndex === currentEntries.length - 1"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { state, updateLocalizationEntry } = useStore()

const viewMode = ref<'list' | 'focus'>('focus')
const focusIndex = ref(0)
const selectedProjectId = ref('')

// For now, hardcoded to "LATAM Distribution Co."
const distributorName = 'LATAM Distribution Co.'
const latamDistributor = computed(() => state.distributors.find(d => d.name === distributorName))

const latamProjects = computed(() => {
  if (!latamDistributor.value) return []
  return state.projects.filter(p => p.distributor_id === latamDistributor.value!.id)
})

const selectedProject = computed(() => {
  if (selectedProjectId.value) return state.projects.find(p => p.id === selectedProjectId.value)
  return latamProjects.value[0] || null
})

// Initialize selectedProjectId
watch(latamProjects, (newVal) => {
  if (newVal.length > 0 && !selectedProjectId.value) {
    selectedProjectId.value = newVal[0].id
  }
}, { immediate: true })

const currentEntries = computed(() => {
  if (!selectedProject.value) return []
  return state.localization.filter(l => l.project_id === selectedProject.value!.id)
})

function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

definePageMeta({
  title: 'Distributor Portal | CREATE'
})
</script>

<style scoped>
.focus-mode-container {
  padding-bottom: 120px;
}

.focus-textarea {
  font-size: var(--font-size-md);
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border-width: 2px;
}

.focus-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-overlay);
  backdrop-filter: blur(16px);
  padding: var(--space-md);
  display: flex;
  gap: var(--space-md);
  border-top: 1px solid var(--color-border);
  z-index: 150;
  max-width: var(--max-content-width);
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .focus-nav {
    left: var(--sidebar-width);
    margin-left: 0;
    max-width: none;
    right: 0;
    padding-left: calc((100vw - var(--sidebar-width) - var(--max-content-width)) / 2 + var(--space-md));
    padding-right: calc((100vw - var(--sidebar-width) - var(--max-content-width)) / 2 + var(--space-md));
  }
}

.justify-between {
  justify-content: space-between;
}

button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.bg-elevated {
  background: var(--color-bg-elevated);
}

.rounded {
  border-radius: var(--radius-md);
}
</style>
