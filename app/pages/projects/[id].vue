<template>
  <div class="page-content">
    <!-- Not found -->
    <div v-if="!project" class="empty-state">
      <p class="empty-state-title">Project not found</p>
      <NuxtLink to="/projects" class="btn btn-primary">← Back to Projects</NuxtLink>
    </div>

    <template v-else>
      <!-- Back + Header -->
      <div class="detail-header">
        <button class="back-button" @click="$router.back()" id="back-from-detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>
        <div class="flex items-center justify-between">
          <input
            v-model="project.project_name"
            class="inline-edit page-title"
            style="flex: 1; padding-left: 0;"
            @blur="persistToggle"
            placeholder="Project Name"
            id="edit-project-name"
          />
          <StatusBadge :status="project.status" />
        </div>
        <div class="card-meta mt-sm">
          <div class="flex items-center gap-xs">
            <span class="text-sm text-muted">🌍</span>
            <input
              v-model="project.territory"
              class="inline-edit text-sm"
              style="width: 80px;"
              @blur="persistToggle"
              placeholder="Territory"
            />
          </div>
          <div class="flex items-center gap-xs">
            <span class="text-sm text-muted">📅</span>
            <input
              v-model="project.due_date"
              type="date"
              class="inline-edit text-sm"
              style="width: 130px;"
              @blur="persistToggle"
            />
          </div>
        </div>
        <ProjectProgress :project="project" />
      </div>

      <!-- Tabs -->
      <div class="tabs" id="detail-tabs">
        <button class="tab" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          Overview
        </button>
        <button class="tab" :class="{ active: activeTab === 'files' }" @click="activeTab = 'files'">
          Files
        </button>
        <button class="tab" :class="{ active: activeTab === 'localization' }" @click="activeTab = 'localization'">
          Script
        </button>
      </div>

      <!-- ─── OVERVIEW TAB ──────────────────────────────────────── -->
      <div v-show="activeTab === 'overview'">
        <!-- Quick Toggles – thumb-friendly switches -->
        <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-sm); color: var(--color-text-secondary);">
            Status Checklist
          </h3>
          <div class="toggle-row">
            <span class="toggle-label">Dubs Received</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="project.dubs_received" @change="persistToggle" id="toggle-dubs" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-row">
            <span class="toggle-label">Logos Received</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="project.logos_received" @change="persistToggle" id="toggle-logos" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-row">
            <span class="toggle-label">Localized Graphics Required</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="project.localized_graphics_required" @change="persistToggle" id="toggle-lg" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-row">
            <span class="toggle-label">Territory Approved</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="project.territory_approved" @change="persistToggle" id="toggle-territory" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-row">
            <span class="toggle-label">Final Approved</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="project.final_approved" @change="persistToggle" id="toggle-final" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Contact Quick Actions -->
        <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-sm); color: var(--color-text-secondary);">
            Contact info
          </h3>
          <div class="form-group mb-sm">
            <input
              v-model="project.primary_contact_name"
              class="inline-edit"
              style="font-weight: 600; font-size: var(--font-size-md); padding-left: 0;"
              placeholder="Contact Name"
              @blur="persistToggle"
            />
          </div>
          <div class="form-group">
            <input
              v-model="project.primary_contact_email"
              class="inline-edit text-sm"
              style="padding-left: 0;"
              placeholder="email@example.com"
              @blur="persistToggle"
            />
          </div>
          <div class="form-group mt-sm">
            <label class="form-label" style="font-size: 10px;">CC Emails</label>
            <input
              v-model="project.cc_emails"
              class="inline-edit text-sm"
              style="padding-left: 0;"
              placeholder="Comma separated emails"
              @blur="persistToggle"
            />
          </div>
          <div class="contact-actions">
            <a
              v-if="project.primary_contact_email"
              :href="`mailto:${project.primary_contact_email}`"
              class="contact-btn"
              id="email-contact"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </a>
            <a
              v-if="project.cc_emails && project.primary_contact_email"
              :href="`mailto:${project.primary_contact_email}?cc=${project.cc_emails}`"
              class="contact-btn"
              id="email-cc"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              CC Group
            </a>
          </div>
        </div>

        <!-- Project Details -->
        <div class="card" style="cursor: default; margin-bottom: var(--space-lg);">
          <h3 style="font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); color: var(--color-text-secondary);">
            Project Metadata
          </h3>
          <div class="detail-row">
            <span class="detail-label">Owner</span>
            <input
              v-model="project.owner_id"
              class="inline-edit detail-value"
              style="text-align: right; width: auto;"
              placeholder="Set Owner"
              @blur="persistToggle"
            />
          </div>
          <div class="detail-row">
            <span class="detail-label">Language 1</span>
            <input
              v-model="project.language_1"
              class="inline-edit detail-value"
              style="text-align: right; width: auto;"
              placeholder="None"
              @blur="persistToggle"
            />
          </div>
          <div class="detail-row">
            <span class="detail-label">Language 2</span>
            <input
              v-model="project.language_2"
              class="inline-edit detail-value"
              style="text-align: right; width: auto;"
              placeholder="None"
              @blur="persistToggle"
            />
          </div>
          <div class="detail-row">
            <span class="detail-label">Distributor</span>
            <select
              v-model="project.distributor_id"
              class="inline-edit detail-value"
              style="text-align: right; width: auto; background: transparent; border: none; padding-right: 20px;"
              @change="persistToggle"
            >
              <option value="">None</option>
              <option v-for="d in state.distributors" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
          <div v-if="project.created_date" class="detail-row">
            <span class="detail-label">Created</span>
            <span class="detail-value text-muted">{{ formatDate(project.created_date) }}</span>
          </div>
          <div style="margin-top: var(--space-md);">
            <label class="form-label" style="display: block; margin-bottom: var(--space-xs);">Project Notes</label>
            <textarea
              v-model="project.notes"
              class="inline-edit text-sm"
              rows="4"
              placeholder="Tap to add notes..."
              @blur="persistToggle"
              style="resize: vertical; min-height: 80px; padding: var(--space-sm); background: var(--color-bg-input); border-radius: var(--radius-sm);"
            ></textarea>
          </div>
        </div>

        <!-- Quick Status Change -->
        <div class="flex items-center justify-between gap-md mt-lg">
          <div class="flex-1">
            <label class="form-label">Set Project Status</label>
            <select
              v-model="project.status"
              class="form-select w-full"
              @change="persistToggle"
              id="status-select"
            >
              <option>New</option>
              <option>In Progress</option>
              <option>Approved</option>
              <option>Completed</option>
            </select>
          </div>
          <button class="btn btn-danger" @click="handleDelete" style="margin-top: 24px;">
            Delete Project
          </button>
        </div>
      </div>

      <!-- ─── FILES TAB ─────────────────────────────────────────── -->
      <div v-show="activeTab === 'files'">
        <div class="section-header">
          <h3 style="font-size: var(--font-size-md); font-weight: 600;">Project Files</h3>
          <button class="btn btn-primary btn-sm" @click="showFileForm = true" id="add-file-btn">+ Add File</button>
        </div>

        <div class="list-stack">
          <div v-for="file in projectFiles" :key="file.id" class="card" style="cursor: default; padding: var(--space-md);">
            <!-- File Name Header -->
            <div class="flex items-center justify-between mb-sm">
              <input
                v-model="file.file_name"
                class="inline-edit"
                style="font-weight: 700; font-size: var(--font-size-md); flex: 1; padding-left: 0;"
                placeholder="File Name"
                @blur="updateProjectFile(file.id, file)"
              />
              <button class="btn btn-ghost btn-sm" @click="removeFile(file.id)" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>

            <!-- Specs Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); border-top: 1px solid var(--color-border); padding-top: var(--space-sm);">
              <div>
                <label class="form-label" style="font-size: 10px;">Frame Size</label>
                <input v-model="file.frame_size" class="inline-edit text-sm" placeholder="e.g. 16:9 HD" @blur="updateProjectFile(file.id, file)" />
              </div>
              <div>
                <label class="form-label" style="font-size: 10px;">Quality</label>
                <input v-model="file.quality" class="inline-edit text-sm" placeholder="e.g. MP4 Sub" @blur="updateProjectFile(file.id, file)" />
              </div>
              <div>
                <label class="form-label" style="font-size: 10px;">Language 1</label>
                <input v-model="file.language_1" class="inline-edit text-sm" placeholder="Primary" @blur="updateProjectFile(file.id, file)" />
              </div>
              <div>
                <label class="form-label" style="font-size: 10px;">Language 2</label>
                <input v-model="file.language_2" class="inline-edit text-sm" placeholder="Secondary" @blur="updateProjectFile(file.id, file)" />
              </div>
              <div>
                <label class="form-label" style="font-size: 10px;">LG Status</label>
                <select v-model="file.lg_status" class="inline-edit text-sm" @change="updateProjectFile(file.id, file)" style="appearance: auto; background: var(--color-bg-input);">
                  <option value="">None</option>
                  <option>In Review</option>
                  <option>Approved</option>
                  <option>Needs Revision</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 10px;">Due Date</label>
                <input v-model="file.due_date" type="date" class="inline-edit text-sm" @blur="updateProjectFile(file.id, file)" />
              </div>
            </div>

            <!-- Links & Notes -->
            <div style="margin-top: var(--space-sm); border-top: 1px solid var(--color-border); padding-top: var(--space-sm);">
              <label class="form-label" style="font-size: 10px;">Frame.io Link</label>
              <div class="flex items-center gap-sm">
                <input v-model="file.frameio_link" class="inline-edit text-sm flex-1" placeholder="Paste link..." @blur="updateProjectFile(file.id, file)" />
                <a v-if="file.frameio_link" :href="file.frameio_link" target="_blank" class="btn btn-ghost btn-sm" title="Open Link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>

            <div style="margin-top: var(--space-sm);">
              <label class="form-label" style="font-size: 10px;">LG Notes</label>
              <textarea v-model="file.lg_notes" class="inline-edit text-xs" rows="1" placeholder="Localization notes..." @blur="updateProjectFile(file.id, file)"></textarea>
            </div>

            <div style="margin-top: var(--space-xs);">
              <label class="form-label" style="font-size: 10px;">General Notes</label>
              <textarea v-model="file.create_notes" class="inline-edit text-xs" rows="1" placeholder="Creation notes..." @blur="updateProjectFile(file.id, file)"></textarea>
            </div>
            
            <div style="margin-top: var(--space-xs);" class="text-xs text-muted">
              Owner: <input v-model="file.owner_name" class="inline-edit text-xs" style="width: auto; display: inline;" placeholder="Set Owner" @blur="updateProjectFile(file.id, file)" />
            </div>
          </div>
        </div>

        <div v-if="projectFiles.length === 0" class="empty-state">
          <p class="empty-state-title text-sm">No files yet</p>
          <p class="empty-state-text text-xs">Add files to track deliverables.</p>
        </div>

        <!-- File Form Modal -->
        <Teleport to="body">
          <div v-if="showFileForm" class="modal-overlay" @click.self="showFileForm = false">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title">Add New File</h2>
                <button class="btn btn-ghost" @click="showFileForm = false">✕</button>
              </div>
              <form @submit.prevent="saveFile">
                <div class="form-group">
                  <label class="form-label">File Name *</label>
                  <input v-model="fileForm.file_name" class="form-input" required placeholder="e.g. Trailer_v2.mp4" id="input-file-name" />
                </div>
                <div class="stats-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 0;">
                  <div class="form-group">
                    <label class="form-label">Frame Size</label>
                    <input v-model="fileForm.frame_size" class="form-input" placeholder="16:9 HD" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Quality</label>
                    <input v-model="fileForm.quality" class="form-input" placeholder="MP4 Sub" />
                  </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block" id="save-file-btn">Add File</button>
              </form>
            </div>
          </div>
        </Teleport>
      </div>

      <!-- ─── LOCALIZATION TAB (Vertical Script View) ────────── -->
      <div v-show="activeTab === 'localization'">
        <div class="section-header">
          <h3 style="font-size: var(--font-size-md); font-weight: 600;">Script Entries</h3>
          <button class="btn btn-primary btn-sm" @click="addNewEntry" id="add-loc-btn">+ Add</button>
        </div>

        <div v-for="entry in locEntries" :key="entry.id" class="loc-card">
          <div class="flex items-center justify-between" style="margin-bottom: var(--space-sm);">
            <div class="flex gap-sm items-center">
              <span class="loc-timecode">{{ entry.timecode_in || '00:00:00:00' }}</span>
              <span class="text-xs text-muted">→</span>
              <span class="loc-timecode">{{ entry.timecode_out || '00:00:00:00' }}</span>
            </div>
            <button class="btn btn-ghost btn-sm" @click="removeEntry(entry.id)" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>

          <!-- Inline Editable Timecodes -->
          <div class="flex gap-sm mb-md">
            <div class="flex-1">
              <label class="form-label" style="font-size: 10px;">TC IN</label>
              <input
                v-model="entry.timecode_in"
                class="inline-edit"
                placeholder="00:00:00:00"
                @blur="persistLoc(entry)"
                style="font-family: monospace; font-size: var(--font-size-sm);"
              />
            </div>
            <div class="flex-1">
              <label class="form-label" style="font-size: 10px;">TC OUT</label>
              <input
                v-model="entry.timecode_out"
                class="inline-edit"
                placeholder="00:00:00:00"
                @blur="persistLoc(entry)"
                style="font-family: monospace; font-size: var(--font-size-sm);"
              />
            </div>
          </div>

          <!-- Inline Editable Dialogue -->
          <div class="mb-md">
            <label class="form-label" style="font-size: 10px;">English Dialogue</label>
            <textarea
              v-model="entry.english_dialogue"
              class="inline-edit"
              rows="2"
              placeholder="Tap to add dialogue..."
              @blur="persistLoc(entry)"
              style="resize: vertical; min-height: 40px;"
            ></textarea>
          </div>

          <!-- On-Screen Text -->
          <div class="mb-md">
            <label class="form-label" style="font-size: 10px;">On-Screen Text</label>
            <textarea
              v-model="entry.english_on_screen_text"
              class="inline-edit"
              rows="1"
              placeholder="Tap to add on-screen text..."
              @blur="persistLoc(entry)"
              style="resize: vertical; min-height: 32px;"
            ></textarea>
          </div>

          <!-- Translations -->
          <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-md); border-top: 1px solid var(--color-border); padding-top: var(--space-md);">
            <div>
              <label class="form-label" style="font-size: 10px; color: var(--color-accent);">{{ project.language_1 || 'Language 1' }} Translation</label>
              <textarea
                v-model="entry.language_1_translation"
                class="inline-edit text-sm"
                rows="2"
                placeholder="Translation 1..."
                @blur="persistLoc(entry)"
                style="background: var(--color-bg-elevated); border-radius: var(--radius-sm);"
              ></textarea>
            </div>
            <div v-if="project.language_2">
              <label class="form-label" style="font-size: 10px; color: var(--color-accent);">{{ project.language_2 }} Translation</label>
              <textarea
                v-model="entry.language_2_translation"
                class="inline-edit text-sm"
                rows="2"
                placeholder="Translation 2..."
                @blur="persistLoc(entry)"
                style="background: var(--color-bg-elevated); border-radius: var(--radius-sm);"
              ></textarea>
            </div>
          </div>
        </div>

        <div v-if="locEntries.length === 0" class="empty-state">
          <p class="empty-state-title text-sm">No script entries</p>
          <p class="empty-state-text text-xs">Add timecoded dialogue and on-screen text.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { LocalizationEntry } from '~/types'

const route = useRoute()
const { 
  state, 
  updateProject, 
  deleteProject, 
  addProjectFile, 
  updateProjectFile, 
  deleteProjectFile, 
  addLocalizationEntry, 
  updateLocalizationEntry, 
  deleteLocalizationEntry 
} = useStore()

const projectId = route.params.id as string
const project = computed(() => state.projects.find(p => p.id === projectId))

const activeTab = ref<'overview' | 'files' | 'localization'>('overview')

const distributorName = computed(() => {
  if (!project.value) return ''
  return state.distributors.find(d => d.id === project.value!.distributor_id)?.name ?? ''
})

const projectFiles = computed(() =>
  state.projectFiles.filter(f => f.project_id === projectId)
)

const locEntries = computed(() =>
  state.localization.filter(l => l.project_id === projectId)
)

// ── Persist toggles immediately ──
function persistToggle() {
  if (project.value) {
    updateProject(project.value.id, { ...project.value })
  }
}

function handleDelete() {
  if (confirm('Are you sure you want to delete this project?')) {
    deleteProject(projectId)
    useRouter().push('/projects')
  }
}

// ── File form ──
const showFileForm = ref(false)
const fileForm = ref({
  file_name: '',
  frame_size: '',
  quality: '',
  language: '',
  lg_status: '',
  frameio_link: '',
  create_notes: ''
})

function saveFile() {
  addProjectFile({
    ...fileForm.value,
    project_id: projectId
  })
  showFileForm.value = false
  fileForm.value = { file_name: '', frame_size: '', quality: '', language: '', lg_status: '', frameio_link: '', create_notes: '' }
}

function removeFile(id: string) {
  deleteProjectFile(id)
}

// ── Localization ──
function addNewEntry() {
  addLocalizationEntry({ project_id: projectId })
}

function persistLoc(entry: LocalizationEntry) {
  updateLocalizationEntry(entry.id, entry)
}

function removeEntry(id: string) {
  deleteLocalizationEntry(id)
}

// ── Helpers ──
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDueClass(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff < 0) return 'due-urgent'
  if (diff < 48 * 60 * 60 * 1000) return 'due-urgent'
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'due-soon'
  return 'text-muted'
}
</script>

<style scoped>
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-border);
}
.detail-row:last-child {
  border-bottom: none;
}
.detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.detail-value {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
