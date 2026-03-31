# Palette Swap — "Ranchita Dusk"

> **Date:** 2026-03-31
> **From:** CChat
> **To:** CC
> **Priority:** Execute before Phase 2b tasks
> **Scope:** CSS custom properties + Tailwind config only — no layout changes

---

## Context

The current palette (`#fff1da` cream base, terra cotta buttons) was a placeholder.
Frederick found his inspiration: the windmill sunset photo (`sunsetwindmill.png`).

I pixel-sampled both photos. The windmill sky is 98.4% sky blue (hue 210°) — the warm
impression is an optical illusion from the gradient contrast and tiny golden cloud highlights.
The big sky hero photo has real warm tones in the golden cloud patches (~hue 30-35°,
centered around `#f3ce79` to `#eac59a`).

The new palette is predominantly **cool blue** with **warm gold accents** — like standing
in Ranchita watching the last light punch through clouds over the mountains.

---

## The Ranchita Dusk Palette

### Dusk (primary — sky blue gradient)

| Stop | Hex | Use |
|------|-----|-----|
| 50 | `#ECEEF5` | Lightest tint, hover backgrounds |
| 100 | `#DDE2EC` | Light surface backgrounds |
| 200 | `#C0CADC` | Borders on dark, disabled states |
| 300 | `#A0B0CC` | Muted text on dark backgrounds |
| 400 | `#8094B8` | Secondary text, icons |
| 500 | `#6478A0` | Mid-tone, links on light backgrounds |
| 600 | `#4A5F85` | Primary links, nav active, info badges |
| 700 | `#344668` | Dark accents, sidebar backgrounds |
| 800 | `#2C3D5E` | Dark text alternative, dark surfaces |
| 900 | `#1A2340` | Darkest — footer, hero overlay, dark mode bg |

### Gold (accent — warm breakthrough)

| Stop | Hex | Use |
|------|-----|-----|
| 50 | `#FEF8F0` | Warm page background option |
| 100 | `#FAE8C8` | Warm surface, highlighted cards |
| 200 | `#F0CA80` | Light accent fills, tags |
| 300 | `#E8BA60` | Badge backgrounds |
| 400 | `#E0A040` | **PRIMARY CTA** — donate, subscribe, key actions |
| 500 | `#D09030` | CTA hover |
| 600 | `#C08828` | CTA active / pressed |
| 700 | `#A07020` | Strong text on gold backgrounds |
| 800 | `#8A5A18` | Text on gold-50/100 backgrounds |
| 900 | `#5C3A10` | Darkest gold text |

### Terra (secondary warm — desert earth)

| Stop | Hex | Use |
|------|-----|-----|
| 50 | `#FAF0EC` | Warm tint backgrounds |
| 100 | `#F0D0C0` | Light terra fills |
| 200 | `#E0A890` | Soft accents |
| 400 | `#C07858` | **SECONDARY CTA** — volunteer, contact |
| 500 | `#B06848` | Hover |
| 600 | `#9A5838` | Active / pressed, badges |
| 800 | `#7A3820` | Text on terra backgrounds |
| 900 | `#4A2010` | Darkest terra |

### Sage (success / nature)

| Stop | Hex | Use |
|------|-----|-----|
| 50 | `#EEF2E8` | Success background tint |
| 100 | `#D0DCC0` | Light success fill |
| 200 | `#A8BC88` | Success borders |
| 400 | `#728A5C` | Success text/icons |
| 600 | `#5A7048` | Strong success |
| 800 | `#3A5028` | Text on sage backgrounds |
| 900 | `#243418` | Darkest sage |

### Stone (neutrals — warm-shifted)

| Stop | Hex | Use |
|------|-----|-----|
| 50 | `#F8F6F4` | **PAGE BACKGROUND** — warm white |
| 100 | `#F0EEEA` | Surface / card background |
| 200 | `#E0DCD8` | Borders, dividers |
| 300 | `#C8C0B8` | Heavier borders |
| 400 | `#A8A098` | Placeholder text, disabled |
| 500 | `#888078` | Muted text |
| 600 | `#6A6460` | Secondary text |
| 700 | `#4A4440` | Strong secondary text |
| 800 | `#2C2824` | **PRIMARY BODY TEXT** |
| 900 | `#1C1A18` | Headings, highest contrast |

---

## globals.css — Replace Existing Custom Properties

```css
:root {
  /* === RANCHITA DUSK PALETTE === */

  /* Dusk sky (primary) */
  --dusk-50: #ECEEF5;
  --dusk-100: #DDE2EC;
  --dusk-200: #C0CADC;
  --dusk-300: #A0B0CC;
  --dusk-400: #8094B8;
  --dusk-500: #6478A0;
  --dusk-600: #4A5F85;
  --dusk-700: #344668;
  --dusk-800: #2C3D5E;
  --dusk-900: #1A2340;

  /* Cloud gold (warm accent) */
  --gold-50: #FEF8F0;
  --gold-100: #FAE8C8;
  --gold-200: #F0CA80;
  --gold-300: #E8BA60;
  --gold-400: #E0A040;
  --gold-500: #D09030;
  --gold-600: #C08828;
  --gold-700: #A07020;
  --gold-800: #8A5A18;
  --gold-900: #5C3A10;

  /* Terra (secondary warm) */
  --terra-50: #FAF0EC;
  --terra-100: #F0D0C0;
  --terra-200: #E0A890;
  --terra-400: #C07858;
  --terra-500: #B06848;
  --terra-600: #9A5838;
  --terra-800: #7A3820;
  --terra-900: #4A2010;

  /* Sage (success / nature) */
  --sage-50: #EEF2E8;
  --sage-100: #D0DCC0;
  --sage-200: #A8BC88;
  --sage-400: #728A5C;
  --sage-600: #5A7048;
  --sage-800: #3A5028;
  --sage-900: #243418;

  /* Stone (warm neutrals) */
  --stone-50: #F8F6F4;
  --stone-100: #F0EEEA;
  --stone-200: #E0DCD8;
  --stone-300: #C8C0B8;
  --stone-400: #A8A098;
  --stone-500: #888078;
  --stone-600: #6A6460;
  --stone-700: #4A4440;
  --stone-800: #2C2824;
  --stone-900: #1C1A18;

  /* === SEMANTIC MAPPINGS === */

  /* Primary action (gold) */
  --color-primary: var(--gold-400);
  --color-primary-hover: var(--gold-500);
  --color-primary-active: var(--gold-600);
  --color-primary-text: var(--gold-900);

  /* Secondary action (terra) */
  --color-secondary: var(--terra-400);
  --color-secondary-hover: var(--terra-500);
  --color-secondary-active: var(--terra-600);

  /* Info / links (dusk) */
  --color-info: var(--dusk-600);
  --color-info-hover: var(--dusk-500);
  --color-info-bg: var(--dusk-50);

  /* Success (sage) */
  --color-success: var(--sage-600);
  --color-success-bg: var(--sage-50);

  /* Warning (gold, reused) */
  --color-warning: var(--gold-600);
  --color-warning-bg: var(--gold-50);

  /* Danger (terra, intensified) */
  --color-danger: #C04040;
  --color-danger-bg: #FEF0F0;

  /* Backgrounds */
  --color-bg-page: var(--stone-50);
  --color-bg-surface: var(--stone-100);
  --color-bg-card: #FFFFFF;
  --color-bg-dark: var(--dusk-900);
  --color-bg-dark-surface: var(--dusk-800);
  --color-bg-warm: var(--gold-50);

  /* Text */
  --color-text-primary: var(--stone-800);
  --color-text-secondary: var(--stone-600);
  --color-text-muted: var(--stone-400);
  --color-text-on-dark: var(--dusk-100);
  --color-text-on-dark-muted: var(--dusk-300);
  --color-text-on-primary: white;
  --color-text-on-secondary: white;

  /* Borders */
  --color-border: var(--stone-200);
  --color-border-light: var(--stone-100);
  --color-border-strong: var(--stone-300);

  /* Fonts (unchanged) */
  --font-body: system-ui, -apple-system, sans-serif;
  --font-heading: system-ui, -apple-system, sans-serif;

  /* Spacing (unchanged) */
  --section-padding: clamp(3rem, 8vw, 6rem);
  --container-max: 1200px;
  --container-padding: clamp(1rem, 4vw, 2rem);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-page: var(--stone-900);
    --color-bg-surface: var(--stone-800);
    --color-bg-card: var(--stone-700);
    --color-bg-dark: var(--dusk-900);
    --color-bg-dark-surface: var(--dusk-800);

    --color-text-primary: var(--stone-100);
    --color-text-secondary: var(--stone-400);
    --color-text-muted: var(--stone-500);

    --color-border: var(--stone-700);
    --color-border-light: var(--stone-800);
    --color-border-strong: var(--stone-600);

    --color-info-bg: var(--dusk-800);
    --color-success-bg: #1A2818;
    --color-warning-bg: var(--gold-900);
    --color-danger-bg: #2A1010;
  }
}
```

---

## tailwind.config.ts — Replace Color Extensions

```ts
colors: {
  dusk: {
    50: 'var(--dusk-50)',
    100: 'var(--dusk-100)',
    200: 'var(--dusk-200)',
    300: 'var(--dusk-300)',
    400: 'var(--dusk-400)',
    500: 'var(--dusk-500)',
    600: 'var(--dusk-600)',
    700: 'var(--dusk-700)',
    800: 'var(--dusk-800)',
    900: 'var(--dusk-900)',
  },
  gold: {
    50: 'var(--gold-50)',
    100: 'var(--gold-100)',
    200: 'var(--gold-200)',
    300: 'var(--gold-300)',
    400: 'var(--gold-400)',
    500: 'var(--gold-500)',
    600: 'var(--gold-600)',
    700: 'var(--gold-700)',
    800: 'var(--gold-800)',
    900: 'var(--gold-900)',
  },
  terra: {
    50: 'var(--terra-50)',
    100: 'var(--terra-100)',
    200: 'var(--terra-200)',
    400: 'var(--terra-400)',
    500: 'var(--terra-500)',
    600: 'var(--terra-600)',
    800: 'var(--terra-800)',
    900: 'var(--terra-900)',
  },
  sage: {
    50: 'var(--sage-50)',
    100: 'var(--sage-100)',
    200: 'var(--sage-200)',
    400: 'var(--sage-400)',
    600: 'var(--sage-600)',
    800: 'var(--sage-800)',
    900: 'var(--sage-900)',
  },
  stone: {
    50: 'var(--stone-50)',
    100: 'var(--stone-100)',
    200: 'var(--stone-200)',
    300: 'var(--stone-300)',
    400: 'var(--stone-400)',
    500: 'var(--stone-500)',
    600: 'var(--stone-600)',
    700: 'var(--stone-700)',
    800: 'var(--stone-800)',
    900: 'var(--stone-900)',
  },
},
```

---

## Component Color Migration Guide

CC should find-and-replace these patterns across all components:

| Old Class/Var | New Class/Var | Where |
|---------------|---------------|-------|
| `bg-sunset-gold` | `bg-gold-400` | CTA buttons |
| `bg-desert-coral` | `bg-terra-400` | Secondary buttons |
| `bg-twilight-purple` | `bg-dusk-700` | Dark accents |
| `bg-sky-blue` | `bg-dusk-500` | Info elements |
| `bg-sage-brush` | `bg-sage-400` | Success states |
| `bg-sandstone` | `bg-stone-100` | Surface backgrounds |
| `bg-warm-white` | `bg-stone-50` | Page background |
| `bg-charcoal-earth` | `bg-stone-800` | Dark text, dark sections |
| `bg-mountain-shadow` | `bg-dusk-900` | Footer, hero overlay |
| `text-charcoal-earth` | `text-stone-800` | Body text |
| `text-sunset-gold` | `text-gold-400` | Accent text |
| `border-*` (old palette) | `border-stone-200` | Standard borders |
| `hover:bg-*` (old warm) | `hover:bg-gold-500` | Primary hover |

Also update:
- Footer background → `bg-dusk-900` (was charcoal-earth)
- Hero overlay text → `text-dusk-100` on `bg-dusk-900/80` backdrop
- Impact stats section → `bg-dusk-900` with `text-dusk-100`
- Newsletter bar → `bg-gold-400` with `text-gold-900`
- Admin sidebar (Phase 2) → `bg-dusk-800` with `text-dusk-100`, active: `bg-dusk-700 border-l-gold-400`

---

## Verify After Swap

1. Homepage hero text readable over the big sky image
2. CTA buttons (Donate, Subscribe) clearly visible as gold-400
3. Footer readable (light text on dusk-900 dark)
4. Impact stats section: high contrast (dusk-100 text on dusk-900 bg)
5. Blog post cards: clean on stone-50 page bg
6. Contact form: inputs have visible borders (stone-200 or stone-300)
7. Mobile nav: legible at all breakpoints
8. Chatbot widget: visible against both light and dark page sections
9. Admin dashboard (if Phase 2a is live): sidebar and KPI cards updated

---

*The Ranchita sky is 98% blue. The 2% gold is what makes it unforgettable.*
