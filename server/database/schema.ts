import { pgTable, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email'),
  company: text('company'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const distributors = pgTable('distributors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  region: text('region'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id),
  distributorId: uuid('distributor_id').references(() => distributors.id),
  projectName: text('project_name').notNull(),
  status: text('status').default('In Progress'),
  dueDate: date('due_date'),
  territory: text('territory'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projectUpdates = pgTable('project_updates', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  updateText: text('update_text').notNull(),
  statusAtTime: text('status_at_time'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
