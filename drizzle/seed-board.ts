/**
 * Seed initial board members into auth_users.
 *
 * Usage: npx tsx drizzle/seed-board.ts
 *
 * Board member emails and roles confirmed 2026-03-31.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL?.trim();
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const BOARD_MEMBERS = [
  { name: 'Frederick Tronboll', email: 'frederick.olaf@gmail.com', role: 'president' }, // Master admin (Tech Advisor) — cannot be deleted
  { name: 'Nicholas Ketelesen', email: 'president@mvvcso.org', role: 'president' },
  { name: 'Kristi Bruner', email: 'secretary@mvvcso.org', role: 'secretary' },
  { name: 'Colleen James', email: 'treasurer@mvvcso.org', role: 'treasurer' },
  { name: 'David Walter', email: 'david@placeholder.mvvcso.org', role: 'vice_president' },
  { name: 'Annette Foote', email: 'annette@placeholder.mvvcso.org', role: 'board_member' },
  { name: 'Gabby Ohmert', email: 'gabby@placeholder.mvvcso.org', role: 'board_member' },
  { name: 'Michelle Erwin', email: 'michelle@placeholder.mvvcso.org', role: 'board_member' },
];

const FOLDER_STRUCTURE = [
  { name: 'Bylaws', accessLevel: 'public', sortOrder: 1 },
  { name: 'Meeting Minutes', accessLevel: 'board', sortOrder: 2 },
  { name: 'Financial Reports', accessLevel: 'officer', sortOrder: 3 },
  { name: 'Grants', accessLevel: 'board', sortOrder: 4 },
  { name: 'Insurance', accessLevel: 'officer', sortOrder: 5 },
  { name: 'Policies & SOPs', accessLevel: 'board', sortOrder: 6 },
  { name: 'Correspondence', accessLevel: 'board', sortOrder: 7 },
  { name: 'Legal', accessLevel: 'officer', sortOrder: 8 },
  { name: 'Templates', accessLevel: 'board', sortOrder: 9 },
];

async function seed() {
  console.log('🌱 Seeding board members...');

  for (const member of BOARD_MEMBERS) {
    await db
      .insert(schema.authUsers)
      .values(member)
      .onConflictDoNothing({ target: schema.authUsers.email });
    console.log(`  ✅ ${member.name} (${member.role})`);
  }

  console.log('\n📁 Seeding document folders...');

  for (const folder of FOLDER_STRUCTURE) {
    await db
      .insert(schema.documentFolders)
      .values(folder)
      .onConflictDoNothing();
    console.log(`  ✅ ${folder.name} (${folder.accessLevel})`);
  }

  console.log('\n✅ Seed complete. David, Annette, Gabby, Michelle still have placeholder emails — update when known.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
