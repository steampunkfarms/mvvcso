export interface WildfirePhase {
  id: 'ready' | 'set' | 'go' | 'return';
  slug: string;
  /** i18n key suffix under wildfire_prep.phases */
  labelKey: string;
  /** i18n key suffix for the short summary */
  summaryKey: string;
  /** lucide-react icon name — resolved at consumer */
  iconName: 'ShieldCheck' | 'Eye' | 'Siren' | 'Home';
}

export const WILDFIRE_PHASES: WildfirePhase[] = [
  {
    id: 'ready',
    slug: 'prepare',
    labelKey: 'phases.ready_label',
    summaryKey: 'phases.ready_summary',
    iconName: 'ShieldCheck',
  },
  {
    id: 'set',
    slug: 'evacuate',
    labelKey: 'phases.set_label',
    summaryKey: 'phases.set_summary',
    iconName: 'Eye',
  },
  {
    id: 'go',
    slug: 'evacuate',
    labelKey: 'phases.go_label',
    summaryKey: 'phases.go_summary',
    iconName: 'Siren',
  },
  {
    id: 'return',
    slug: 'evacuate',
    labelKey: 'phases.return_label',
    summaryKey: 'phases.return_summary',
    iconName: 'Home',
  },
];
