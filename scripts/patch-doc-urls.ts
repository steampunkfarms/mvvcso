/**
 * Patch transparency-docs.ts with Vercel Blob URLs from the upload map.
 *
 * Usage:
 *   npx tsx scripts/upload-transparency-docs.ts   # first: upload
 *   npx tsx scripts/patch-doc-urls.ts             # then: patch source
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const MAP_PATH = join(__dirname, 'blob-url-map.json');
const DOCS_PATH = join(__dirname, '..', 'src', 'lib', 'transparency-docs.ts');

const urlMap: Record<string, string> = JSON.parse(readFileSync(MAP_PATH, 'utf-8'));
let source = readFileSync(DOCS_PATH, 'utf-8');

let patched = 0;

for (const [fileName, url] of Object.entries(urlMap)) {
  // Escape the filename for use in regex
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Find patterns like: fileName: 'Some File.pdf', and add fileUrl after
  // Also handle: largeFileName, esFileName, esLargeFileName
  const patterns = [
    { field: 'fileName', urlField: 'fileUrl' },
    { field: 'largeFileName', urlField: 'largeFileUrl' },
    { field: 'esFileName', urlField: 'esFileUrl' },
    { field: 'esLargeFileName', urlField: 'esLargeFileUrl' },
  ];

  for (const { field, urlField } of patterns) {
    const regex = new RegExp(
      `(${field}: '${escaped}',?)\\n(?!\\s*${urlField}:)`,
    );
    if (regex.test(source)) {
      source = source.replace(regex, `$1\n    ${urlField}: '${url}',\n`);
      patched++;
    }
  }
}

// Also patch meeting minutes - find fileName patterns in MINUTE_FILES
// These are just strings in an array, so we patch the MeetingMinute objects differently.
// Minutes get their fileUrl set at runtime from a URL map we'll export.
// Actually let's add a MINUTE_URL_MAP export.

const minuteEntries: string[] = [];
for (const [fileName, url] of Object.entries(urlMap)) {
  if (fileName.includes('Meeting_Minutes') || fileName.includes('MVVCSO_Meeting') || fileName.includes('MVVCSO_Board_Meeting')) {
    minuteEntries.push(`  '${fileName}': '${url}',`);
  }
}

if (minuteEntries.length > 0) {
  // Add the URL map before the parseMinuteFile function or at the end
  const mapBlock = `\nexport const MINUTE_URL_MAP: Record<string, string> = {\n${minuteEntries.join('\n')}\n};\n`;

  // Check if it already exists
  if (source.includes('MINUTE_URL_MAP')) {
    // Replace existing
    source = source.replace(
      new RegExp('export const MINUTE_URL_MAP: Record<string, string> = \\{[^}]*\\};', 's'),
      mapBlock.trim(),
    );
  } else {
    // Insert before the MINUTE_FILES array
    source = source.replace(
      '// All meeting minute files',
      `${mapBlock}\n// All meeting minute files`,
    );
  }

  // Update the parseMinuteFile results to include fileUrl from the map
  // We need to modify the MEETING_MINUTES export to apply URLs
  if (!source.includes('MINUTE_URL_MAP[m.fileName]')) {
    source = source.replace(
      ".sort((a, b) => a.date.localeCompare(b.date));",
      ".sort((a, b) => a.date.localeCompare(b.date))\n  .map((m) => ({ ...m, fileUrl: MINUTE_URL_MAP[m.fileName] }));",
    );
  }
}

writeFileSync(DOCS_PATH, source);
console.log(`Patched ${patched} document URLs + ${minuteEntries.length} minute URLs`);
