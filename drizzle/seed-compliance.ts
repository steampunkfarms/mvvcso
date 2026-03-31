/**
 * Seed compliance tasks from the MVVCSO Annual Compliance Checklist
 * plus California nonprofit state filings (FBN, SoS SI-100).
 *
 * Usage: npx tsx drizzle/seed-compliance.ts
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

const YEAR = new Date().getFullYear();

interface TaskDef {
  title: string;
  titleEs?: string;
  description: string;
  category: string;
  dueDate: Date;
  priority: string;
  recurrence: string;
  notes?: string;
}

const COMPLIANCE_TASKS: TaskDef[] = [
  // ── President / General ──────────────────────────────────────
  {
    title: 'Fictitious Business Name (FBN) Renewal',
    titleEs: 'Renovación de Nombre Comercial Ficticio (FBN)',
    description: 'Renew the FBN filing with San Diego County Clerk. FBN expires every 5 years and must be renewed before expiration to maintain the right to conduct business under "MVVCSO." File with the San Diego County Clerk\'s office.',
    category: 'state_filing',
    dueDate: new Date(YEAR, 11, 31), // Placeholder — update with actual expiration
    priority: 'high',
    recurrence: 'every_5_years',
    notes: 'Filed with San Diego County Clerk. Check original filing date to determine exact renewal deadline. Costs ~$40. Must also re-publish in local newspaper.',
  },
  {
    title: 'Secretary of State — Statement of Information (SI-100)',
    titleEs: 'Secretario de Estado — Declaración de Información (SI-100)',
    description: 'File the biennial Statement of Information (Form SI-100) with the California Secretary of State. This filing designates the Registered Agent for service of process and updates officer/director information. File online at bizfile.sos.ca.gov.',
    category: 'state_filing',
    dueDate: new Date(YEAR, 3, 30), // Due during the applicable filing period
    priority: 'high',
    recurrence: 'biennial',
    notes: 'Filing fee: $20. Designates Registered Agent (currently the principal office at 37370 Montezuma Valley Rd). Must list all current officers and directors. Late filing: $50 penalty.',
  },
  {
    title: 'Annual Board Report Submission',
    titleEs: 'Presentación del Informe Anual de la Junta',
    description: 'Comprehensive Annual Report covering financial status, membership growth, achievements, grants, and initiatives per Article VII, Section 3.',
    category: 'reporting',
    dueDate: new Date(YEAR, 0, 31), // Jan 31
    priority: 'high',
    recurrence: 'annual',
    notes: 'Publish digitally; post physical copy at MVVCSO principal office; provide large-print versions.',
  },

  // ── Secretary ────────────────────────────────────────────────
  {
    title: 'Annual Membership Roster Review & Update',
    titleEs: 'Revisión y Actualización Anual del Registro de Membresía',
    description: 'Verification of Voting Member eligibility, annual verification of residency per Article III, Section 3B, accessibility accommodations per Article XV.',
    category: 'governance',
    dueDate: new Date(YEAR, 11, 15), // Dec 15
    priority: 'high',
    recurrence: 'annual',
    notes: 'Maintain securely at principal office; provide digital view-only access if approved by Board.',
  },
  {
    title: 'Annual General Meeting Notice Distribution',
    titleEs: 'Distribución de Aviso de Asamblea General Anual',
    description: 'Minimum 30-day advance notice, per Article III, Section 4A, ensuring accessibility accommodations.',
    category: 'governance',
    dueDate: new Date(YEAR, 10, 1), // Nov 1
    priority: 'critical',
    recurrence: 'annual',
    notes: 'Distribute via online channels, community bulletins, mailed flyers, and food bank postings.',
  },
  {
    title: 'Annual Conflict of Interest Disclosure Update',
    titleEs: 'Actualización Anual de Divulgación de Conflicto de Intereses',
    description: 'Annual conflict disclosure form collected from all Directors and Officers per Article IV, Section 6B.',
    category: 'governance',
    dueDate: new Date(YEAR, 0, 31), // Jan 31
    priority: 'high',
    recurrence: 'annual',
    notes: 'Retain signed copies securely; review annually at first Board meeting.',
  },
  {
    title: 'Annual Bylaws & SOP Compliance Review',
    titleEs: 'Revisión Anual de Cumplimiento de Estatutos y PEO',
    description: 'Verification and confirmation that MVVCSO Standard Operating Procedures are updated and posted publicly as required in bylaws.',
    category: 'governance',
    dueDate: new Date(YEAR, 11, 31), // Dec 31
    priority: 'normal',
    recurrence: 'annual',
    notes: 'Cross-check SOPs against recent Board resolutions; maintain SOP digital library.',
  },
  {
    title: 'Annual Volunteer & Committee Appointments Review',
    titleEs: 'Revisión Anual de Nombramientos de Voluntarios y Comités',
    description: 'Confirm committee compositions, appointments, and responsibilities alignment per Article VI.',
    category: 'governance',
    dueDate: new Date(YEAR, 0, 31), // Jan 31
    priority: 'normal',
    recurrence: 'annual',
    notes: 'Update publicly accessible roster; confirm each committee\'s compliance status.',
  },
  {
    title: 'Annual Whistleblower Policy & Ethics Review',
    titleEs: 'Revisión Anual de Política de Denunciantes y Ética',
    description: 'Review policy adherence and ensure clear whistleblower channels per Article XI.',
    category: 'governance',
    dueDate: new Date(YEAR, 2, 15), // Mar 15
    priority: 'normal',
    recurrence: 'annual',
    notes: 'Review policy annually at Board meeting; confirm confidential reporting channels are effective.',
  },

  // ── Treasurer ────────────────────────────────────────────────
  {
    title: 'IRS Form 990 Filing',
    titleEs: 'Presentación del Formulario 990 del IRS',
    description: 'Ensure accurate reporting of annual financial activity; confirm appropriate signatures and public disclosure.',
    category: 'tax_filing',
    dueDate: new Date(YEAR, 3, 15), // Apr 15 (or May 15 with extension)
    priority: 'critical',
    recurrence: 'annual',
    notes: 'Submit electronically via IRS e-file; retain copies digitally and physically. File Form 990-N (e-Postcard) if gross receipts < $50,000, otherwise 990-EZ or full 990.',
  },
  {
    title: 'State Charity Registration Renewal (RRF-1)',
    titleEs: 'Renovación de Registro de Caridad Estatal (RRF-1)',
    description: 'Maintain compliance with California Attorney General\'s Registry of Charitable Trusts, Form RRF-1.',
    category: 'state_filing',
    dueDate: new Date(YEAR, 4, 15), // May 15 (4mo 15d after fiscal year close)
    priority: 'critical',
    recurrence: 'annual',
    notes: 'File online with Registry of Charitable Trusts; maintain confirmation receipt. Due within 4 months, 15 days after close of fiscal year.',
  },
  {
    title: 'Insurance Policies Annual Review & Renewal',
    titleEs: 'Revisión y Renovación Anual de Pólizas de Seguro',
    description: 'General Liability, D&O Liability, Property Insurance per Article X, Section 2.',
    category: 'insurance',
    dueDate: new Date(YEAR, 11, 1), // Dec 1
    priority: 'high',
    recurrence: 'annual',
    notes: 'Store insurance documents digitally and physically; ensure comprehensive risk coverage.',
  },
  {
    title: 'Annual Audit Preparation (Internal/External)',
    titleEs: 'Preparación de Auditoría Anual (Interna/Externa)',
    description: 'Compile financial records, audit reports, and transaction documentation for periodic audit readiness.',
    category: 'financial',
    dueDate: new Date(YEAR, 2, 31), // Mar 31
    priority: 'high',
    recurrence: 'annual',
    notes: 'Maintain audit records at principal office; coordinate with Finance Committee.',
  },
  {
    title: 'Annual Grant Compliance & Reporting',
    titleEs: 'Cumplimiento y Reporte Anual de Subvenciones',
    description: 'Compile and submit all required reports for grants received per Article XIV.',
    category: 'financial',
    dueDate: new Date(YEAR, 11, 31), // Varies by grant — Dec 31 as fallback
    priority: 'high',
    recurrence: 'annual',
    notes: 'Maintain grant compliance files digitally; report submission logged and confirmed. Actual deadlines depend on individual grant terms.',
  },

  // ── Joint (Secretary & Treasurer) ────────────────────────────
  {
    title: 'Accessibility Policy Review & Budget Allocation',
    titleEs: 'Revisión de Política de Accesibilidad y Asignación Presupuestaria',
    description: 'Annual budget set for accessibility per Article XV, with transportation and accommodation review.',
    category: 'governance',
    dueDate: new Date(YEAR, 10, 15), // Nov 15
    priority: 'normal',
    recurrence: 'annual',
    notes: 'Budget approval documented in Board Minutes; policy posted publicly with accommodations detailed.',
  },
  {
    title: 'Record Retention Schedule Audit',
    titleEs: 'Auditoría del Programa de Retención de Registros',
    description: 'Annual verification of document retention log compliance with retention policies.',
    category: 'governance',
    dueDate: new Date(YEAR, 11, 31), // Dec 31
    priority: 'normal',
    recurrence: 'annual',
    notes: 'Log document destructions; verify adherence to retention periods per MVVCSO policy.',
  },
];

async function seed() {
  console.log('🛡️  Seeding compliance tasks...\n');

  for (const task of COMPLIANCE_TASKS) {
    await db
      .insert(schema.complianceTasks)
      .values({
        title: task.title,
        titleEs: task.titleEs,
        description: task.description,
        category: task.category,
        dueDate: task.dueDate,
        priority: task.priority,
        recurrence: task.recurrence,
        notes: task.notes,
      })
      .onConflictDoNothing();
    console.log(`  ✅ ${task.title} (${task.category} — ${task.priority})`);
  }

  console.log(`\n✅ Seeded ${COMPLIANCE_TASKS.length} compliance tasks.`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
