// ── localStorage-backed composable store ─────────────────────────────
// Replaces Supabase for local-first development

import { v4 as uuidv4 } from 'uuid'
import type {
  AppState,
  Client,
  Distributor,
  Project,
  ProjectFile,
  LocalizationEntry,
  ProjectStatus
} from '~/types'

const STORAGE_KEY = 'createAdAgency_store'

function loadState(): AppState {
  if (import.meta.server) {
    return { clients: [], distributors: [], projects: [], projectFiles: [], localization: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupted – start fresh
  }
  return { clients: [], distributors: [], projects: [], projectFiles: [], localization: [] }
}

function saveState(state: AppState) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Singleton reactive state
const state = reactive<AppState>(loadState())

// Auto-persist on every mutation
if (import.meta.client) {
  watch(
    () => state,
    () => saveState(toRaw(state) as AppState),
    { deep: true }
  )
}

export function useStore() {
  // ── Hydrate on client after SSR ─────────────────────────────────
  if (import.meta.client && state.clients.length === 0) {
    const loaded = loadState()
    Object.assign(state, loaded)
  }

  // ── CLIENTS ─────────────────────────────────────────────────────
  function addClient(data: Partial<Client>): Client {
    const client: Client = {
      id: uuidv4(),
      name: data.name ?? '',
      distributors_list: data.distributors_list ?? '',
      notes: data.notes ?? '',
      created_at: new Date().toISOString()
    }
    state.clients.push(client)
    return client
  }
  function updateClient(id: string, data: Partial<Client>) {
    const idx = state.clients.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(state.clients[idx], data)
  }
  function deleteClient(id: string) {
    state.clients = state.clients.filter(c => c.id !== id)
  }

  // ── DISTRIBUTORS ────────────────────────────────────────────────
  function addDistributor(data: Partial<Distributor>): Distributor {
    const dist: Distributor = {
      id: uuidv4(),
      name: data.name ?? '',
      location: data.location ?? '',
      phone: data.phone ?? '',
      notes: data.notes ?? '',
      website: data.website ?? '',
      client_id: data.client_id ?? '',
      created_at: new Date().toISOString()
    }
    state.distributors.push(dist)
    return dist
  }
  function updateDistributor(id: string, data: Partial<Distributor>) {
    const idx = state.distributors.findIndex(d => d.id === id)
    if (idx !== -1) Object.assign(state.distributors[idx], data)
  }
  function deleteDistributor(id: string) {
    state.distributors = state.distributors.filter(d => d.id !== id)
  }

  // ── PROJECTS ────────────────────────────────────────────────────
  function addProject(data: Partial<Project>): Project {
    const project: Project = {
      id: uuidv4(),
      project_name: data.project_name ?? '',
      created_date: data.created_date ?? new Date().toISOString().slice(0, 10),
      owner_id: data.owner_id ?? '',
      notes: data.notes ?? '',
      distributor_id: data.distributor_id ?? '',
      status: (data.status as ProjectStatus) ?? 'New',
      due_date: data.due_date ?? '',
      territory: data.territory ?? '',
      language_1: data.language_1 ?? '',
      language_2: data.language_2 ?? '',
      primary_contact_name: data.primary_contact_name ?? '',
      primary_contact_email: data.primary_contact_email ?? '',
      cc_emails: data.cc_emails ?? '',
      localized_graphics_required: data.localized_graphics_required ?? false,
      dubs_received: data.dubs_received ?? false,
      logos_received: data.logos_received ?? false,
      territory_approved: data.territory_approved ?? false,
      final_approved: data.final_approved ?? false,
      created_at: new Date().toISOString()
    }
    state.projects.push(project)
    return project
  }
  function updateProject(id: string, data: Partial<Project>) {
    const idx = state.projects.findIndex(p => p.id === id)
    if (idx !== -1) Object.assign(state.projects[idx], data)
  }
  function deleteProject(id: string) {
    state.projects = state.projects.filter(p => p.id !== id)
    // Cascade delete
    state.projectFiles = state.projectFiles.filter(f => f.project_id !== id)
    state.localization = state.localization.filter(l => l.project_id !== id)
  }

  // ── PROJECT FILES ───────────────────────────────────────────────
  function addProjectFile(data: Partial<ProjectFile>): ProjectFile {
    const file: ProjectFile = {
      id: uuidv4(),
      project_id: data.project_id ?? '',
      due_date: data.due_date ?? '',
      file_name: data.file_name ?? '',
      frame_size: data.frame_size ?? '',
      quality: data.quality ?? '',
      language: data.language ?? '',
      language_1: data.language_1 ?? '',
      language_2: data.language_2 ?? '',
      frameio_link: data.frameio_link ?? '',
      lg_status: data.lg_status ?? '',
      lg_notes: data.lg_notes ?? '',
      create_notes: data.create_notes ?? '',
      owner_name: data.owner_name ?? '',
      created_at: new Date().toISOString()
    }
    state.projectFiles.push(file)
    return file
  }
  function updateProjectFile(id: string, data: Partial<ProjectFile>) {
    const idx = state.projectFiles.findIndex(f => f.id === id)
    if (idx !== -1) Object.assign(state.projectFiles[idx], data)
  }
  function deleteProjectFile(id: string) {
    state.projectFiles = state.projectFiles.filter(f => f.id !== id)
  }

  // ── LOCALIZATION ────────────────────────────────────────────────
  function addLocalizationEntry(data: Partial<LocalizationEntry>): LocalizationEntry {
    const entry: LocalizationEntry = {
      id: uuidv4(),
      project_id: data.project_id ?? '',
      timecode_in: data.timecode_in ?? '',
      timecode_out: data.timecode_out ?? '',
      english_dialogue: data.english_dialogue ?? '',
      english_on_screen_text: data.english_on_screen_text ?? '',
      language_1_translation: data.language_1_translation ?? '',
      language_2_translation: data.language_2_translation ?? '',
      created_at: new Date().toISOString()
    }
    state.localization.push(entry)
    return entry
  }
  function updateLocalizationEntry(id: string, data: Partial<LocalizationEntry>) {
    const idx = state.localization.findIndex(l => l.id === id)
    if (idx !== -1) Object.assign(state.localization[idx], data)
  }
  function deleteLocalizationEntry(id: string) {
    state.localization = state.localization.filter(l => l.id !== id)
  }

  // ── Seed demo data ─────────────────────────────────────────────
  function seedDemoData() {
    if (state.clients.length > 0) return // already seeded

    const client = addClient({
      name: 'Warner Bros. Pictures',
      notes: 'Major studio client for international releases'
    })
    const client2 = addClient({
      name: 'Universal Studios',
      notes: 'Animated features and live action'
    })

    const dist = addDistributor({
      name: 'LATAM Distribution Co.',
      location: 'Mexico City, MX',
      phone: '+52 55 1234 5678',
      website: 'https://latamco.example.com',
      client_id: client.id
    })
    const dist2 = addDistributor({
      name: 'UK Media Partners',
      location: 'London, UK',
      phone: '+44 20 7946 0958',
      website: 'https://ukmedia.example.com',
      client_id: client2.id
    })

    const proj1 = addProject({
      project_name: 'Dark Knight Rises – LATAM Dub',
      owner_id: 'Dhaval Patel',
      distributor_id: dist.id,
      status: 'In Progress',
      due_date: '2026-04-20',
      territory: 'LATAM',
      language_1: 'Spanish',
      language_2: 'Portuguese',
      primary_contact_name: 'Maria Garcia',
      primary_contact_email: 'maria@latamco.example.com',
      cc_emails: 'team@latamco.example.com',
      dubs_received: true,
      logos_received: true,
      localized_graphics_required: true
    })

    const proj2 = addProject({
      project_name: 'Minions: Rise of Gru – UK Localization',
      owner_id: 'Dhaval Patel',
      distributor_id: dist2.id,
      status: 'New',
      due_date: '2026-04-25',
      territory: 'UK',
      language_1: 'English (British)',
      primary_contact_name: 'James Smith',
      primary_contact_email: 'james@ukmedia.example.com'
    })

    const proj3 = addProject({
      project_name: 'Aquaman 2 – LATAM Subtitles',
      owner_id: 'Dhaval Patel',
      distributor_id: dist.id,
      status: 'Approved',
      due_date: '2026-04-18',
      territory: 'LATAM',
      language_1: 'Spanish',
      dubs_received: true,
      logos_received: true,
      territory_approved: true,
      final_approved: true,
      primary_contact_name: 'Carlos Ruiz',
      primary_contact_email: 'carlos@latamco.example.com'
    })

    // Files for project 1
    addProjectFile({
      project_id: proj1.id,
      file_name: 'DKR_LATAM_Trailer_v2.mp4',
      frame_size: '16:9 HD',
      quality: 'MP4 Subtitled',
      language: 'Spanish',
      lg_status: 'In Review'
    })
    addProjectFile({
      project_id: proj1.id,
      file_name: 'DKR_LATAM_Poster_Final.psd',
      frame_size: '27x40',
      quality: 'Print Ready',
      language: 'Spanish',
      lg_status: 'Approved'
    })

    // Localization for project 1
    addLocalizationEntry({
      project_id: proj1.id,
      timecode_in: '00:00:15:00',
      timecode_out: '00:00:18:12',
      english_dialogue: 'The fire rises.',
      english_on_screen_text: ''
    })
    addLocalizationEntry({
      project_id: proj1.id,
      timecode_in: '00:00:22:00',
      timecode_out: '00:00:26:04',
      english_dialogue: 'When Gotham is ashes, you have my permission to die.',
      english_on_screen_text: ''
    })
    addLocalizationEntry({
      project_id: proj1.id,
      timecode_in: '00:01:05:00',
      timecode_out: '00:01:08:15',
      english_dialogue: '',
      english_on_screen_text: 'GOTHAM CITY - 8 YEARS LATER'
    })
  }

  return {
    state,
    // Clients
    addClient,
    updateClient,
    deleteClient,
    // Distributors
    addDistributor,
    updateDistributor,
    deleteDistributor,
    // Projects
    addProject,
    updateProject,
    deleteProject,
    // Project Files
    addProjectFile,
    updateProjectFile,
    deleteProjectFile,
    // Localization
    addLocalizationEntry,
    updateLocalizationEntry,
    deleteLocalizationEntry,
    // Utility
    seedDemoData
  }
}
