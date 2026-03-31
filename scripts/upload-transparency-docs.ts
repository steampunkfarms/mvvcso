/**
 * Upload all transparency documents to Vercel Blob and output a URL map.
 *
 * Usage:
 *   npx tsx scripts/upload-transparency-docs.ts
 *
 * Requires: BLOB_READ_WRITE_TOKEN in .env.local
 * Source:   /Users/ericktronboll/Projects/mvvcso transparency docs/
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { put } from '@vercel/blob';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const SOURCE_DIR = '/Users/ericktronboll/Projects/mvvcso transparency docs';
const MAP_OUTPUT = join(__dirname, '..', 'scripts', 'blob-url-map.json');

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN?.trim();
if (!BLOB_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN not set in .env.local');
  process.exit(1);
}

async function main() {
  const files = readdirSync(SOURCE_DIR).filter(
    (f) => f.endsWith('.pdf') && !f.startsWith('.')
  );

  // Deduplicate: skip " (1)" copies
  const deduped = files.filter((f) => !f.includes(' (1)'));
  console.log(`Found ${files.length} PDFs, ${deduped.length} after dedup\n`);

  const urlMap: Record<string, string> = {};
  let uploaded = 0;
  let skipped = 0;

  for (const fileName of deduped) {
    const filePath = join(SOURCE_DIR, fileName);
    const fileBuffer = readFileSync(filePath);

    // Sanitize filename for blob path
    const blobPath = `transparency/${sanitize(fileName)}`;

    try {
      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        contentType: 'application/pdf',
        token: BLOB_TOKEN,
      });
      urlMap[fileName] = blob.url;
      uploaded++;
      console.log(`  [${uploaded}/${deduped.length}] ${fileName}`);
    } catch (err) {
      console.error(`  SKIP ${fileName}: ${err instanceof Error ? err.message : err}`);
      skipped++;
    }
  }

  // Write URL map to JSON for the patch script
  writeFileSync(MAP_OUTPUT, JSON.stringify(urlMap, null, 2));
  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped`);
  console.log(`URL map written to ${MAP_OUTPUT}`);
}

function sanitize(name: string): string {
  return name
    .replace(/[áàâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^\w.\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
