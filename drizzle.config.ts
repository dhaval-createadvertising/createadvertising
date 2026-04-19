import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:AgencySecure2026!@136.107.192.153:5432/agency',
  },
});
