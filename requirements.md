1. Core Product VisionA lightweight, mobile-first Production Tracking Portal that allows project managers and clients to view status, upload files, and approve localization timecodes without the "clutter" of the Coda grid interface.2. Functional Requirements (Mobile-First)A. View: Dashboard & Project ListSimple List View: Replace the wide Coda table with a "Card" layout. Each card displays:Project Name & Status (Color-coded: New, In-Progress, Approved).Territory (e.g., LATAM, UK).Due Date (Highlighting if < 48 hours).Search & Filter: A sticky search bar at the top to filter by Client or Distributor.B. View: Project Detail & ActionsQuick Toggles: Large, thumb-friendly switches for the status fields (Dubs Received, Logos Received, Territory Approved).Contact Info: One-tap icons to email the Primary Contact or CC group directly from the app.File Management: A simplified "Upload" button that sends files directly to Supabase Storage, automatically linking them to the Project Files table.C. View: Localization Grid (Simplified)The Problem: Horizontal scrolling in Coda's Localization table is a major UX pain point on mobile.The Solution: A "Vertical Script View." Each timecode entry is a card showing:Timecode IN/OUTEnglish DialogueOn-Screen TextIn-line Editing: Tap to edit dialogue directly without opening a sub-menu.3. Technical Requirements (for Antigravity)Vibe Code Integration: Use Antigravity to generate UI components that follow a "Clean Utility" aesthetic (minimal borders, high contrast, generous padding).State Management: Implement Zustand for real-time UI updates (e.g., toggling a "Received" checkbox updates the UI instantly before the Supabase sync completes).Auth: Direct integration with Supabase Auth—Clients should only see projects where their client_id matches.4. UI/UX Improvements over CodaFeatureCoda Pain PointMobile-First App SolutionNavigationSidebars and nested pages are hard to tap.Bottom tab navigation (Dashboard, Projects, Settings).Data EntryTiny cells make typing difficult.Full-screen "Edit Mode" with large text inputs.VisibilityToo many columns visible at once.Progress bars and "Status Badges" for at-a-glance info.SpeedLarge docs take time to "calculate."Native Nuxt 3 speed with 



SQL Structure - 

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Clients Table
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  distributors_list text, -- Note: In Coda this is a multi-select/lookup
  notes text,
  created_at timestamp with time zone default now()
);

-- 2. Distributors Table
create table distributors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text,
  phone text,
  notes text,
  website text,
  client_id uuid references clients(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- 3. Projects Table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  project_name text not null,
  created_date date default current_date,
  owner_id text, -- Maps to 'Person' field (e.g., Dhaval Patel)
  notes text,
  distributor_id uuid references distributors(id) on delete cascade,
  status text, -- e.g., 'New', 'In Progress'
  due_date date,
  territory text,
  language_1 text,
  language_2 text,
  primary_contact_name text,
  primary_contact_email text,
  cc_emails text,
  -- Status Checkboxes
  localized_graphics_required boolean default false,
  dubs_received boolean default false,
  logos_received boolean default false,
  territory_approved boolean default false,
  final_approved boolean default false,
  created_at timestamp with time zone default now()
);

-- 4. Project Files Table
create table project_files (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  due_date date,
  file_name text not null,
  frame_size text, -- e.g., '16:9 HD'
  quality text,     -- e.g., 'MP4 Subtitled'
  language text,
  language_1 text,
  language_2 text,
  frameio_link text,
  lg_status text,
  lg_notes text,
  create_notes text,
  owner_name text,
  created_at timestamp with time zone default now()
);

-- 5. Localization Table
create table localization (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  timecode_in text,  -- Using text to preserve '00:00:00:00' format
  timecode_out text,
  english_dialogue text,
  english_on_screen_text text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table clients enable row level security;
alter table distributors enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table localization enable row level security;