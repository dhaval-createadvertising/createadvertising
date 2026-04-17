// ── TypeScript Interfaces ────────────────────────────────────────────
// Mirror the SQL schema from requirements.md but use localStorage

export type ProjectStatus = 'New' | 'In Progress' | 'Approved' | 'Completed'

export interface Client {
  id: string
  name: string
  distributors_list: string
  notes: string
  created_at: string
}

export interface Distributor {
  id: string
  name: string
  location: string
  phone: string
  notes: string
  website: string
  client_id: string
  created_at: string
}

export interface Project {
  id: string
  project_name: string
  created_date: string
  owner_id: string
  notes: string
  distributor_id: string
  status: ProjectStatus
  due_date: string
  territory: string
  language_1: string
  language_2: string
  primary_contact_name: string
  primary_contact_email: string
  cc_emails: string
  // Status checkboxes
  localized_graphics_required: boolean
  dubs_received: boolean
  logos_received: boolean
  territory_approved: boolean
  final_approved: boolean
  created_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  due_date: string
  file_name: string
  frame_size: string
  quality: string
  language: string
  language_1: string
  language_2: string
  frameio_link: string
  lg_status: string
  lg_notes: string
  create_notes: string
  owner_name: string
  created_at: string
}

export interface LocalizationEntry {
  id: string
  project_id: string
  timecode_in: string
  timecode_out: string
  english_dialogue: string
  english_on_screen_text: string
  language_1_translation?: string
  language_2_translation?: string
  created_at: string
}

// ── Store State ──────────────────────────────────────────────────────

export interface AppState {
  clients: Client[]
  distributors: Distributor[]
  projects: Project[]
  projectFiles: ProjectFile[]
  localization: LocalizationEntry[]
}
