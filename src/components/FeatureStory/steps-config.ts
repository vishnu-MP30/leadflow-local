// ═════════════════════════════════════════════════════════════════
// FEATURE STORY CONFIGURATION — THE LEADFLOW PIPELINE ENGINE
// All copy, colors, steps, and timings are defined here.
// ═════════════════════════════════════════════════════════════════

export interface StepItem {
  id: string;
  index: string;           // e.g. "01"
  letter: string;          // e.g. "R"
  tabLabel: string;        // e.g. "RESEARCH"
  eyebrow: string;         // e.g. "LEADFLOW ENGINE · 01"
  heading: string;         // Max 6 words
  paragraph: string;       // Max 22 words
  bullets: string[];
  coordinates: string;     // Blueprint decoration e.g. "[12.4, 88.0]"
  accentHighlight: string; // Key phrase to emphasize
}

export const FEATURE_STORY_CONFIG = {
  // Theme Tokens
  theme: {
    bg: '#FFFFFF',
    bgCard: '#FFFFFF',
    ink: '#0B1B3D',
    inkMuted: '#64748B',
    inkLight: '#94A3B8',
    border: '#E2E8F0',
    borderDark: 'rgba(11, 27, 61, 0.12)',
    accent: '#D93D94',
    accentLight: '#FF3388',
    accentTint: 'rgba(217, 61, 148, 0.12)',
    shadowOffset: '6px 6px 0px #0B1B3D',
  },

  // Section Intro Block
  intro: {
    badge: '[ THE FRAMEWORK ]',
    title: 'The 4 method.',
    description:
      'Technology accelerates faster every day. Most sales pipelines fall behind. LeadFlow is the continuous four-phase engine that closes that gap — turning cold prospect lists into predictable revenue conversations. No bloat. No spam. No excuses.',
    phaseList: ['DISCOVER', 'DIAGNOSE', 'COORDINATE', 'PROGRESS'],
  },

  // Exactly 4 Core Pipeline Engine Phases
  steps: [
    {
      id: 'step-1',
      index: '01',
      letter: 'R',
      tabLabel: 'RESEARCH',
      eyebrow: 'LEADFLOW ENGINE · 01',
      heading: 'Discover high-intent accounts.',
      paragraph:
        'Enrich existing prospect lists and LinkedIn URLs with verified signals before writing a single word.',
      bullets: [
        'Ingest raw prospect lists and LinkedIn URLs.',
        'Enrich verified professional & company signals.',
      ],
      coordinates: '[01.12, 44.80]',
      accentHighlight: 'LinkedIn profile URLs',
    },
    {
      id: 'step-2',
      index: '02',
      letter: 'P',
      tabLabel: 'PERSONALISE',
      eyebrow: 'LEADFLOW ENGINE · 02',
      heading: 'Hyper-tailored multi-channel copy.',
      paragraph:
        'Autonomous agents synthesize prospect pain points and live company triggers into bespoke messages that convert.',
      bullets: [
        'Generate bespoke copy from real prospect context.',
        'Prepare tailored sequences for LinkedIn and email.',
      ],
      coordinates: '[02.34, 62.15]',
      accentHighlight: 'bespoke copy',
    },
    {
      id: 'step-3',
      index: '03',
      letter: 'C',
      tabLabel: 'COORDINATE',
      eyebrow: 'LEADFLOW ENGINE · 03',
      heading: 'Synchronized multi-channel sequence.',
      paragraph:
        'Unify LinkedIn outreach and email follow-ups into one autonomous sequence that automatically pauses on replies.',
      bullets: [
        'Coordinate multi-channel touchpoints automatically.',
        'Auto-pauses sequence instantly when prospect engages.',
      ],
      coordinates: '[03.58, 79.40]',
      accentHighlight: 'auto-pauses sequence',
    },
    {
      id: 'step-4',
      index: '04',
      letter: 'P',
      tabLabel: 'PROGRESS',
      eyebrow: 'LEADFLOW ENGINE · 04',
      heading: 'Classify intent and book.',
      paragraph:
        'Detect interested prospects, overcome initial friction, and schedule qualified sales meetings directly onto your calendar.',
      bullets: [
        'Classify reply sentiment and intent in real-time.',
        'Directly schedule qualified meetings to your calendar.',
      ],
      coordinates: '[04.92, 98.60]',
      accentHighlight: 'qualified meetings',
    },
  ] as StepItem[],

  // Animation Timings & Options
  animation: {
    scrub: 0.8,
    pinAnticipate: 1,
    holdDuration: 1.0,      // Hold time on each step
    transitionDuration: 1.0, // Duration of the traveling line wipe
    enableSnap: false,       // Light snap to step labels toggle
  },
};
