/**
 * Transparency document metadata — static index of all public governance docs.
 * File URLs are populated after Vercel Blob upload via seed script.
 * Until then, pages render with document names and "Upload pending" status.
 */

export interface TransparencyDoc {
  slug: string;
  title: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  fileName: string;
  /** Vercel Blob URL — set after upload */
  fileUrl?: string;
  /** Large-print version */
  largeFileName?: string;
  largeFileUrl?: string;
  /** Spanish version file */
  esFileName?: string;
  esFileUrl?: string;
  esLargeFileName?: string;
  esLargeFileUrl?: string;
}

export interface MeetingMinute {
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
  title: string;
  type: 'regular' | 'special' | 'closed' | 'public';
  status: 'minutes' | 'no_minutes' | 'no_meeting' | 'no_quorum' | 'postponed';
  fileName: string;
  fileUrl?: string;
}

// ── Categories ────────────────────────────────────────────────────

export const RESOURCE_CATEGORIES = [
  {
    slug: 'bylaws',
    title: 'Bylaws',
    titleEs: 'Estatutos',
    description: 'The governing document of MVVCSO, ratified by the membership.',
    descriptionEs: 'El documento rector de MVVCSO, ratificado por la membresía.',
    icon: 'BookOpen',
    color: 'terra',
  },
  {
    slug: 'policies',
    title: 'Policies',
    titleEs: 'Políticas',
    description: '17 board-adopted policies covering ethics, privacy, fundraising, and more.',
    descriptionEs: '17 políticas adoptadas por la junta que cubren ética, privacidad, recaudación de fondos y más.',
    icon: 'Shield',
    color: 'dusk',
  },
  {
    slug: 'sops',
    title: 'Standard Operating Procedures',
    titleEs: 'Procedimientos Operativos Estándar',
    description: 'How committees, officers, and volunteers operate day-to-day.',
    descriptionEs: 'Cómo operan comités, oficiales y voluntarios en el día a día.',
    icon: 'ClipboardList',
    color: 'sage',
  },
  {
    slug: 'forms',
    title: 'Forms & Applications',
    titleEs: 'Formularios y Solicitudes',
    description: 'Membership applications, misconduct reporting, and other forms.',
    descriptionEs: 'Solicitudes de membresía, reportes de conducta y otros formularios.',
    icon: 'FileEdit',
    color: 'gold',
  },
  {
    slug: 'maps',
    title: 'Boundary Maps',
    titleEs: 'Mapas de Límites',
    description: 'Defined precinct boundaries for MVVCSO voting membership.',
    descriptionEs: 'Límites definidos del área para membresía con derecho a voto.',
    icon: 'Map',
    color: 'terra',
  },
  {
    slug: 'minutes',
    title: 'Meeting Minutes',
    titleEs: 'Actas de Reuniones',
    description: 'Board meeting minutes from 2020 to present, organized by year.',
    descriptionEs: 'Actas de reuniones de la junta desde 2020 hasta el presente, organizadas por año.',
    icon: 'Calendar',
    color: 'dusk',
  },
] as const;

// ── Community Safety Categories ───────────────────────────────────

export const COMMUNITY_SAFETY_CATEGORIES = [
  {
    slug: 'wildfire-preparedness',
    title: 'Wildfire Preparedness',
    titleEs: '__TODO_ES__ Preparación para Incendios Forestales',
    description: 'Backcountry-tailored wildfire readiness for Ranchita and the Montezuma Valley.',
    descriptionEs: '__TODO_ES__ Preparación backcountry para incendios forestales en Ranchita y el Valle de Montezuma.',
    icon: 'Flame',
    color: 'terra',
  },
] as const;

// ── Bylaws ────────────────────────────────────────────────────────

export const BYLAWS: TransparencyDoc[] = [
  {
    slug: 'bylaws-2025',
    title: 'MVVCSO Bylaws — Ratified June 18, 2025',
    titleEs: 'MVVCSO Estatutos — Ratificados el 18 de junio de 2025',
    description: 'The current governing bylaws of MVVCSO, approved by membership vote.',
    fileName: 'MVVCSO BYLAWS Ratified June 18 2025.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/MVVCSO_BYLAWS_Ratified_June_18_2025.pdf',
    largeFileName: 'MVVCSO BYLAWS Ratified June 18 2025 _ Large.pdf',
    largeFileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/MVVCSO_BYLAWS_Ratified_June_18_2025_Large.pdf',
    esFileName: 'MVVCSO ESTATUTOS Ratificados el 18 de junio de.pdf',
    esFileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/MVVCSO_ESTATUTOS_Ratificados_el_18_de_junio_de.pdf',
  },
];

// ── Policies ──────────────────────────────────────────────────────

export const POLICIES: TransparencyDoc[] = [
  {
    slug: 'pol-1',
    title: 'Good Standing Policy',
    titleEs: 'Política de Buen Estatus',
    fileName: 'POL_1 Good Standing Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_1_Good_Standing_Policy.pdf',
    esFileName: 'MVVCSO - Política de Buen Estatus.pdf',
    esLargeFileName: 'MVVCSO - Política de Buen Estatus - Grande.pdf',
  },
  {
    slug: 'pol-2',
    title: 'Membership Categories Policy',
    fileName: 'POL_2 Membership Categories Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_2_Membership_Categories_Policy.pdf',
  },
  {
    slug: 'pol-3',
    title: 'Board Size Adjustment Policy',
    fileName: 'POL_3 Board Size Adjustment Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_3_Board_Size_Adjustment_Policy.pdf',
  },
  {
    slug: 'pol-4',
    title: 'Vacancy Filling Policy',
    fileName: 'POL_4 Vacancy Filling Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_4_Vacancy_Filling_Policy.pdf',
  },
  {
    slug: 'pol-5',
    title: 'Conflict of Interest Policy',
    fileName: 'POL_5 Conflict of Interest Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_5_Conflict_of_Interest_Policy.pdf',
  },
  {
    slug: 'pol-6',
    title: 'Records Management Policy',
    fileName: 'POL_6 Records Management Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_6_Records_Management_Policy.pdf',
  },
  {
    slug: 'pol-7',
    title: 'Insurance Review Policy',
    fileName: 'POL_7 Insurance Review Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_7_Insurance_Review_Policy.pdf',
  },
  {
    slug: 'pol-8',
    title: 'Whistleblower Protection Policy',
    fileName: 'POL_8 Whistleblower Protection Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_8_Whistleblower_Protection_Policy.pdf',
  },
  {
    slug: 'pol-9',
    title: 'Inclusivity Policy',
    fileName: 'POL_9 Inclusivity Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_9_Inclusivity_Policy.pdf',
  },
  {
    slug: 'pol-10',
    title: 'Accessibility Policy',
    fileName: 'POL_10 Accessibility Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_10_Accessibility_Policy.pdf',
  },
  {
    slug: 'pol-11',
    title: 'Director Attendance and Removal Policy',
    fileName: 'POL_11 Director Attendance and Removal Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_11_Director_Attendance_and_Removal_Policy.pdf',
  },
  {
    slug: 'pol-12',
    title: 'Data Protection / Privacy Policy',
    fileName: 'POL_12 Data Protection_Privacy Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_12_Data_Protection_Privacy_Policy.pdf',
  },
  {
    slug: 'pol-13',
    title: 'Permitted Use Agreement — Digital Services',
    fileName: 'POL_13 Permitted Use Agreement - Digital Servi.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_13_Permitted_Use_Agreement_-_Digital_Servi.pdf',
  },
  {
    slug: 'pol-14',
    title: 'Debit Card Use Policy for Officers',
    fileName: 'POL_14 Debit Card Use Policy for Officers.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_14_Debit_Card_Use_Policy_for_Officers.pdf',
  },
  {
    slug: 'pol-15',
    title: 'Fundraising Policy',
    fileName: 'POL_15 Fundraising Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_15_Fundraising_Policy.pdf',
  },
  {
    slug: 'pol-16',
    title: 'Code of Ethics and Conduct Policy',
    fileName: 'POL_16 Code of Ethics and Conduct Policy.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_16_Code_of_Ethics_and_Conduct_Policy.pdf',
  },
  {
    slug: 'pol-17',
    title: 'Annual Verification of Personal Auto Insurance',
    fileName: 'POL_17 Annual Verification of Personal Auto In.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/POL_17_Annual_Verification_of_Personal_Auto_In.pdf',
  },
];

// ── SOPs ──────────────────────────────────────────────────────────

export const SOPS: TransparencyDoc[] = [
  {
    slug: 'sop-2',
    title: 'Officer Roles and Responsibilities',
    fileName: 'SOP_2 Officer Roles and Responsibilities Stand.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_2_Officer_Roles_and_Responsibilities_Stand.pdf',
  },
  {
    slug: 'sop-3',
    title: 'Vice Officer Roles',
    fileName: 'SOP_3 Vice Officer Roles Standard Operating Pr.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_3_Vice_Officer_Roles_Standard_Operating_Pr.pdf',
  },
  {
    slug: 'sop-4-1',
    title: 'Election Committee',
    fileName: 'SOP_4.1 Election Committee .pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_4.1_Election_Committee_.pdf',
  },
  {
    slug: 'sop-4-2',
    title: 'Grant Committee',
    fileName: 'SOP_4.2 Grant Committee.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_4.2_Grant_Committee.pdf',
  },
  {
    slug: 'sop-4-3',
    title: 'Finance Committee',
    fileName: 'SOP_4.3 Finance Committee.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_4.3_Finance_Committee.pdf',
  },
  {
    slug: 'sop-4-4',
    title: 'Ethics Committee',
    fileName: 'SOP_4.4 Ethics Committee.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_4.4_Ethics_Committee.pdf',
  },
  {
    slug: 'sop-5',
    title: 'Volunteer Management',
    fileName: 'SOP_5 Volunteer Management Standard Operating .pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_5_Volunteer_Management_Standard_Operating_.pdf',
  },
  {
    slug: 'sop-6',
    title: 'Grant Application and Management',
    fileName: 'SOP_6 Grant Application and Management Standar.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_6_Grant_Application_and_Management_Standar.pdf',
  },
  {
    slug: 'sop-7',
    title: 'Emeritus Board Member Involvement',
    fileName: 'SOP_7  Emeritus Board Member Involvement.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_7_Emeritus_Board_Member_Involvement.pdf',
  },
  {
    slug: 'sop-8',
    title: 'Accessibility Committee',
    fileName: 'SOP_8 Accessibility Committee Standard Operati.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_8_Accessibility_Committee_Standard_Operati.pdf',
  },
  {
    slug: 'sop-9',
    title: 'Community Engagement Committee',
    fileName: 'SOP_9 Community Engagement Committee.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_9_Community_Engagement_Committee.pdf',
  },
  {
    slug: 'sop-10',
    title: 'Emergency Response Committee',
    fileName: 'SOP_10 Emergency Response Committee Standard O.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_10_Emergency_Response_Committee_Standard_O.pdf',
  },
  {
    slug: 'sop-11',
    title: 'Volunteer Committee',
    fileName: 'SOP_11 Volunteer Committee Standard Operating .pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_11_Volunteer_Committee_Standard_Operating_.pdf',
  },
  {
    slug: 'sop-12',
    title: 'Youth Engagement Committee',
    fileName: 'SOP_12 Youth Engagement Committee Standard Ope.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/SOP_12_Youth_Engagement_Committee_Standard_Ope.pdf',
  },
];

// ── Forms ─────────────────────────────────────────────────────────

export const FORMS: TransparencyDoc[] = [
  {
    slug: 'voting-member-application',
    title: 'Voting Member Application',
    titleEs: 'Formulario de Solicitud para Miembros con Derecho a Voto',
    description: 'Apply for voting membership in MVVCSO.',
    fileName: 'Voting Member Application.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Voting_Member_Application.pdf',
    esFileName: 'Formulario de Solicitud para Miembros con Dere.pdf',
    esFileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Formulario_de_Solicitud_para_Miembros_con_Dere.pdf',
  },
  {
    slug: 'misconduct-report',
    title: 'Misconduct Report Form',
    titleEs: 'Formulario de Reporte de Conducta Inapropiada',
    description: 'Report misconduct or ethical violations confidentially.',
    fileName: 'Misconduct Report Form.pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Misconduct_Report_Form.pdf',
    largeFileName: 'Misconduct Report Form - Large.pdf',
    largeFileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Misconduct_Report_Form_-_Large.pdf',
    esFileName: 'Formulario de Reporte de Conducta Inapropiada.pdf',
    esFileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Formulario_de_Reporte_de_Conducta_Inapropiada.pdf',
  },
];

// ── Boundary Maps ─────────────────────────────────────────────────

export const MAPS: TransparencyDoc[] = [
  {
    slug: 'precinct-boundaries',
    title: 'Defined Precinct Boundaries for MVVCSO Voting',
    titleEs: 'Límites definidos del Área para Membresía con Derecho a Voto',
    description: 'Geographic boundaries defining MVVCSO voting eligibility.',
    fileName: 'Defined Precinct Boundaries for MVVCSO Voting .pdf',
    fileUrl: 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Defined_Precinct_Boundaries_for_MVVCSO_Voting_.pdf',
    esFileName: 'Límites definidos del Área para Membresía c.pdf',
  },
];

// ── Meeting Minutes ───────────────────────────────────────────────

function parseMinuteFile(fileName: string): MeetingMinute | null {
  // Match: Meeting_Minutes_YYYY_MM_DD[_suffix].pdf
  const match = fileName.match(/Meeting_Minutes_(\d{4})_(\d{2})_(\d{2})(?:_(.+))?\.pdf$/);
  if (!match) {
    // Handle special format: MVVCSO_Board_Meeting_Minutes_YYYY-MM-DD.pdf
    const alt = fileName.match(/MVVCSO_(?:Board_)?Meeting_Minutes_(\d{4})-(\d{2})-(\d{2})\.pdf$/);
    if (!alt) {
      // Handle: MVVCSO_Meeting_Minutes_M_D_YY.pdf
      const alt2 = fileName.match(/MVVCSO_Meeting_Minutes_(\d+)_(\d+)_(\d{2})\.pdf$/);
      if (!alt2) return null;
      const [, m, d, yy] = alt2;
      const year = 2000 + parseInt(yy);
      const month = parseInt(m);
      const day = parseInt(d);
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return {
        date: dateStr,
        year,
        month,
        title: formatMinuteTitle(year, month, day, 'regular', 'minutes'),
        type: 'regular',
        status: 'minutes',
        fileName,
      };
    }
    const [, y, m, d] = alt;
    const year = parseInt(y);
    const month = parseInt(m);
    const day = parseInt(d);
    const dateStr = `${y}-${m}-${d}`;
    return {
      date: dateStr,
      year,
      month,
      title: formatMinuteTitle(year, month, day, 'regular', 'minutes'),
      type: 'regular',
      status: 'minutes',
      fileName,
    };
  }

  const [, y, m, d, suffix] = match;
  const year = parseInt(y);
  const month = parseInt(m);
  const day = parseInt(d);
  const dateStr = `${y}-${m}-${d}`;

  let type: MeetingMinute['type'] = 'regular';
  let status: MeetingMinute['status'] = 'minutes';

  const sfx = (suffix || '').toLowerCase();
  if (sfx.includes('special') && sfx.includes('closed')) type = 'closed';
  else if (sfx.includes('special')) type = 'special';
  else if (sfx.includes('public')) type = 'public';

  if (sfx.includes('no_minutes') || sfx.includes('no minutes')) status = 'no_minutes';
  else if (sfx.includes('no_meeting') || sfx.includes('no meeting')) status = 'no_meeting';
  else if (sfx.includes('no_quorum') || sfx.includes('no quorum')) status = 'no_quorum';
  else if (sfx.includes('postponed')) status = 'postponed';

  return {
    date: dateStr,
    year,
    month,
    title: formatMinuteTitle(year, month, day, type, status),
    type,
    status,
    fileName,
  };
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatMinuteTitle(
  year: number,
  month: number,
  day: number,
  type: MeetingMinute['type'],
  status: MeetingMinute['status'],
): string {
  const dateLabel = `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
  const typeLabel =
    type === 'special' ? ' — Special Meeting' :
    type === 'closed' ? ' — Special Closed Meeting' :
    type === 'public' ? ' — Public Meeting' : '';
  const statusLabel =
    status === 'no_minutes' ? ' (No Minutes Recorded)' :
    status === 'no_meeting' ? ' (No Meeting Held)' :
    status === 'no_quorum' ? ' (No Quorum)' :
    status === 'postponed' ? ' (Postponed)' : '';

  return `${dateLabel}${typeLabel}${statusLabel}`;
}


export const MINUTE_URL_MAP: Record<string, string> = {
  'MVVCSO_Board_Meeting_Minutes_2025-11-15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/MVVCSO_Board_Meeting_Minutes_2025-11-15.pdf',
  'MVVCSO_Meeting_Minutes_6_5_25.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/MVVCSO_Meeting_Minutes_6_5_25.pdf',
  'Meeting_Minutes_2020_01_21_No_Minutes.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_01_21_No_Minutes.pdf',
  'Meeting_Minutes_2020_02_18_No_Minutes.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_02_18_No_Minutes.pdf',
  'Meeting_Minutes_2020_03_17_No_Minutes.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_03_17_No_Minutes.pdf',
  'Meeting_Minutes_2020_04_19_No_Minutes.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_04_19_No_Minutes.pdf',
  'Meeting_Minutes_2020_05_19.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_05_19.pdf',
  'Meeting_Minutes_2020_06_23_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_06_23_No_Meeting.pdf',
  'Meeting_Minutes_2020_07_21.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_07_21.pdf',
  'Meeting_Minutes_2020_08_18_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_08_18_No_Meeting.pdf',
  'Meeting_Minutes_2020_09_15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_09_15.pdf',
  'Meeting_Minutes_2020_10_20_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_10_20_No_Meeting.pdf',
  'Meeting_Minutes_2020_11_17_Postponed.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_11_17_Postponed.pdf',
  'Meeting_Minutes_2020_12_15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2020_12_15.pdf',
  'Meeting_Minutes_2021_01_19.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_01_19.pdf',
  'Meeting_Minutes_2021_02_16_No_Quorum.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_02_16_No_Quorum.pdf',
  'Meeting_Minutes_2021_03_16_No_Quorum.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_03_16_No_Quorum.pdf',
  'Meeting_Minutes_2021_04_20.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_04_20.pdf',
  'Meeting_Minutes_2021_05_18.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_05_18.pdf',
  'Meeting_Minutes_2021_06_15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_06_15.pdf',
  'Meeting_Minutes_2021_07_20.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_07_20.pdf',
  'Meeting_Minutes_2021_08_17.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_08_17.pdf',
  'Meeting_Minutes_2021_09_21.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_09_21.pdf',
  'Meeting_Minutes_2021_10_19_No_Minutes.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_10_19_No_Minutes.pdf',
  'Meeting_Minutes_2021_11_16_No_Minutes.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_11_16_No_Minutes.pdf',
  'Meeting_Minutes_2021_12_21_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2021_12_21_No_Meeting.pdf',
  'Meeting_Minutes_2022_01_25.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_01_25.pdf',
  'Meeting_Minutes_2022_02_15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_02_15.pdf',
  'Meeting_Minutes_2022_03_15_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_03_15_No_Meeting.pdf',
  'Meeting_Minutes_2022_04_19_No_Meeting_No_Quoru.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_04_19_No_Meeting_No_Quoru.pdf',
  'Meeting_Minutes_2022_05_22.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_05_22.pdf',
  'Meeting_Minutes_2022_06_21.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_06_21.pdf',
  'Meeting_Minutes_2022_07_19_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_07_19_No_Meeting.pdf',
  'Meeting_Minutes_2022_08_16_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_08_16_No_Meeting.pdf',
  'Meeting_Minutes_2022_09_20.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_09_20.pdf',
  'Meeting_Minutes_2022_10_18.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_10_18.pdf',
  'Meeting_Minutes_2022_11_15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_11_15.pdf',
  'Meeting_Minutes_2022_12_20_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2022_12_20_No_Meeting.pdf',
  'Meeting_Minutes_2023_01_17.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_01_17.pdf',
  'Meeting_Minutes_2023_02_21_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_02_21_No_Meeting.pdf',
  'Meeting_Minutes_2023_03_21_No_Quorum.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_03_21_No_Quorum.pdf',
  'Meeting_Minutes_2023_04_18_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_04_18_No_Meeting.pdf',
  'Meeting_Minutes_2023_05_15_Postponed.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_05_15_Postponed.pdf',
  'Meeting_Minutes_2023_06_20.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_06_20.pdf',
  'Meeting_Minutes_2023_07_12.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_07_12.pdf',
  'Meeting_Minutes_2023_08_15.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_08_15.pdf',
  'Meeting_Minutes_2023_09_19_No_Quorum.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_09_19_No_Quorum.pdf',
  'Meeting_Minutes_2023_10_17.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_10_17.pdf',
  'Meeting_Minutes_2023_11_21.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_11_21.pdf',
  'Meeting_Minutes_2023_12_19.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2023_12_19.pdf',
  'Meeting_Minutes_2024_01_16.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_01_16.pdf',
  'Meeting_Minutes_2024_02_20_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_02_20_No_Meeting.pdf',
  'Meeting_Minutes_2024_03_19.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_03_19.pdf',
  'Meeting_Minutes_2024_04_16_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_04_16_No_Meeting.pdf',
  'Meeting_Minutes_2024_05_21.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_05_21.pdf',
  'Meeting_Minutes_2024_06_18.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_06_18.pdf',
  'Meeting_Minutes_2024_07_16_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_07_16_No_Meeting.pdf',
  'Meeting_Minutes_2024_08_20.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_08_20.pdf',
  'Meeting_Minutes_2024_09_17.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_09_17.pdf',
  'Meeting_Minutes_2024_10_15_No_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_10_15_No_Meeting.pdf',
  'Meeting_Minutes_2024_11_19.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_11_19.pdf',
  'Meeting_Minutes_2024_12_17.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2024_12_17.pdf',
  'Meeting_Minutes_2025_01_21.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_01_21.pdf',
  'Meeting_Minutes_2025_02_25.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_02_25.pdf',
  'Meeting_Minutes_2025_03_18.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_03_18.pdf',
  'Meeting_Minutes_2025_03_28_Special_Closed_Meet.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_03_28_Special_Closed_Meet.pdf',
  'Meeting_Minutes_2025_04_01.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_04_01.pdf',
  'Meeting_Minutes_2025_04_03_Special_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_04_03_Special_Meeting.pdf',
  'Meeting_Minutes_2025_04_15_Special_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_04_15_Special_Meeting.pdf',
  'Meeting_Minutes_2025_04_27_Special_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_04_27_Special_Meeting.pdf',
  'Meeting_Minutes_2025_05_24.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_05_24.pdf',
  'Meeting_Minutes_2025_06_18_Special_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_06_18_Special_Meeting.pdf',
  'Meeting_Minutes_2025_06_28_Public_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_06_28_Public_Meeting.pdf',
  'Meeting_Minutes_2025_07_15_SpecialMeeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_07_15_SpecialMeeting.pdf',
  'Meeting_Minutes_2025_08_23.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_08_23.pdf',
  'Meeting_Minutes_2025_09_01_Special_Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_09_01_Special_Meeting.pdf',
  'Meeting_Minutes_2025_10_14_Special Meeting.pdf': 'https://j2li4wufsfo7i28i.public.blob.vercel-storage.com/transparency/Meeting_Minutes_2025_10_14_Special_Meeting.pdf',
};

// All meeting minute files — deduplicated (skip "(1)" copies)
const MINUTE_FILES = [
  'Meeting_Minutes_2020_01_21_No_Minutes.pdf',
  'Meeting_Minutes_2020_02_18_No_Minutes.pdf',
  'Meeting_Minutes_2020_03_17_No_Minutes.pdf',
  'Meeting_Minutes_2020_04_19_No_Minutes.pdf',
  'Meeting_Minutes_2020_05_19.pdf',
  'Meeting_Minutes_2020_06_23_No_Meeting.pdf',
  'Meeting_Minutes_2020_07_21.pdf',
  'Meeting_Minutes_2020_08_18_No_Meeting.pdf',
  'Meeting_Minutes_2020_09_15.pdf',
  'Meeting_Minutes_2020_10_20_No_Meeting.pdf',
  'Meeting_Minutes_2020_11_17_Postponed.pdf',
  'Meeting_Minutes_2020_12_15.pdf',
  'Meeting_Minutes_2021_01_19.pdf',
  'Meeting_Minutes_2021_02_16_No_Quorum.pdf',
  'Meeting_Minutes_2021_03_16_No_Quorum.pdf',
  'Meeting_Minutes_2021_04_20.pdf',
  'Meeting_Minutes_2021_05_18.pdf',
  'Meeting_Minutes_2021_06_15.pdf',
  'Meeting_Minutes_2021_07_20.pdf',
  'Meeting_Minutes_2021_08_17.pdf',
  'Meeting_Minutes_2021_09_21.pdf',
  'Meeting_Minutes_2021_10_19_No_Minutes.pdf',
  'Meeting_Minutes_2021_11_16_No_Minutes.pdf',
  'Meeting_Minutes_2021_12_21_No_Meeting.pdf',
  'Meeting_Minutes_2022_01_25.pdf',
  'Meeting_Minutes_2022_02_15.pdf',
  'Meeting_Minutes_2022_03_15_No_Meeting.pdf',
  'Meeting_Minutes_2022_04_19_No_Meeting_No_Quoru.pdf',
  'Meeting_Minutes_2022_05_22.pdf',
  'Meeting_Minutes_2022_06_21.pdf',
  'Meeting_Minutes_2022_07_19_No_Meeting.pdf',
  'Meeting_Minutes_2022_08_16_No_Meeting.pdf',
  'Meeting_Minutes_2022_09_20.pdf',
  'Meeting_Minutes_2022_10_18.pdf',
  'Meeting_Minutes_2022_11_15.pdf',
  'Meeting_Minutes_2022_12_20_No_Meeting.pdf',
  'Meeting_Minutes_2023_01_17.pdf',
  'Meeting_Minutes_2023_02_21_No_Meeting.pdf',
  'Meeting_Minutes_2023_03_21_No_Quorum.pdf',
  'Meeting_Minutes_2023_04_18_No_Meeting.pdf',
  'Meeting_Minutes_2023_05_15_Postponed.pdf',
  'Meeting_Minutes_2023_06_20.pdf',
  'Meeting_Minutes_2023_07_12.pdf',
  'Meeting_Minutes_2023_08_15.pdf',
  'Meeting_Minutes_2023_09_19_No_Quorum.pdf',
  'Meeting_Minutes_2023_10_17.pdf',
  'Meeting_Minutes_2023_11_21.pdf',
  'Meeting_Minutes_2023_12_19.pdf',
  'Meeting_Minutes_2024_01_16.pdf',
  'Meeting_Minutes_2024_02_20_No_Meeting.pdf',
  'Meeting_Minutes_2024_03_19.pdf',
  'Meeting_Minutes_2024_04_16_No_Meeting.pdf',
  'Meeting_Minutes_2024_05_21.pdf',
  'Meeting_Minutes_2024_06_18.pdf',
  'Meeting_Minutes_2024_07_16_No_Meeting.pdf',
  'Meeting_Minutes_2024_08_20.pdf',
  'Meeting_Minutes_2024_09_17.pdf',
  'Meeting_Minutes_2024_10_15_No_Meeting.pdf',
  'Meeting_Minutes_2024_11_19.pdf',
  'Meeting_Minutes_2024_12_17.pdf',
  'Meeting_Minutes_2025_01_21.pdf',
  'Meeting_Minutes_2025_02_25.pdf',
  'Meeting_Minutes_2025_03_18.pdf',
  'Meeting_Minutes_2025_03_28_Special_Closed_Meet.pdf',
  'Meeting_Minutes_2025_04_01.pdf',
  'Meeting_Minutes_2025_04_03_Special_Meeting.pdf',
  'Meeting_Minutes_2025_04_15_Special_Meeting.pdf',
  'Meeting_Minutes_2025_04_27_Special_Meeting.pdf',
  'Meeting_Minutes_2025_05_24.pdf',
  'Meeting_Minutes_2025_06_18_Special_Meeting.pdf',
  'Meeting_Minutes_2025_06_28_Public_Meeting.pdf',
  'Meeting_Minutes_2025_07_15_SpecialMeeting.pdf',
  'Meeting_Minutes_2025_08_23.pdf',
  'Meeting_Minutes_2025_09_01_Special_Meeting.pdf',
  'Meeting_Minutes_2025_10_14_Special Meeting.pdf',
  'MVVCSO_Board_Meeting_Minutes_2025-11-15.pdf',
  'MVVCSO_Meeting_Minutes_6_5_25.pdf',
];

export const MEETING_MINUTES: MeetingMinute[] = MINUTE_FILES
  .map(parseMinuteFile)
  .filter((m): m is MeetingMinute => m !== null)
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((m) => ({ ...m, fileUrl: MINUTE_URL_MAP[m.fileName] }));

export const MINUTE_YEARS = [...new Set(MEETING_MINUTES.map((m) => m.year))].sort();

export function getMinutesByYear(year: number): MeetingMinute[] {
  return MEETING_MINUTES.filter((m) => m.year === year);
}
