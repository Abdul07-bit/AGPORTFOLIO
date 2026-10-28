// Shared content types. Data files stay free of runtime imports so that
// vite.config.ts can read them at build time (sitemap, JSON-LD, meta tags).

export type ProjectStatusKind = 'live' | 'demo' | 'prototype' | 'concept'

export interface ProjectStatus {
  kind: ProjectStatusKind
  /** Short public label, e.g. "Live website". */
  label: string
}

export interface ProjectLink {
  label: string
  href: string
  kind: 'live' | 'demo' | 'repo' | 'external'
  /**
   * Only verified links are rendered. Set to false when a destination is
   * known to be offline so visitors never land on a dead page.
   */
  verified: boolean
  /** Internal note explaining the verification state (not rendered). */
  note?: string
}

export interface ProjectScreenshot {
  src: string
  alt: string
  caption: string
  width: number
  height: number
  device: 'desktop' | 'mobile'
}

export type CoverKey = 'formlaw' | 'datafusion' | 'rizan' | 'vkt' | 'smartautoflex' | 'ticketing'

export interface ProjectTheme {
  /** Accent used inside the project's own artwork and detail page. */
  accent: string
  /** Background of the cover artwork. */
  surface: string
  /** Foreground on the cover surface. */
  ink: string
}

export interface Project {
  slug: string
  index: string
  /** Short name, e.g. "DataFusion". */
  name: string
  /** Full case-study title. */
  title: string
  /** Text after the em dash in the title. */
  subtitle: string
  type: string
  status: ProjectStatus
  categories: string[]
  summary: string
  cover: CoverKey
  theme: ProjectTheme
  role: string
  overview: string
  problem: string
  goals: string[]
  /** Optional note on the project's visual design (rendered as its own section). */
  visualDirection?: string
  contribution: string[]
  workflow: {
    title: string
    caption?: string
    steps: { label: string; detail: string }[]
  }
  features: { title: string; detail: string; status?: string }[]
  stack: {
    title: string
    note?: string
    groups: { label: string; items: string[] }[]
  }
  screenshots: ProjectScreenshot[]
  lessons: { title: string; detail: string }[]
  /** Section title for lessons ("Challenges & lessons" or "Design considerations"). */
  lessonsTitle: string
  links: ProjectLink[]
  /** Public footnote describing where the facts on the page come from. */
  sourceNote: string
}

export interface SkillCategory {
  id: 'software' | 'ai' | 'devops' | 'product'
  index: string
  name: string
  short: string
  description: string
  skills: { name: string; related?: string[] }[]
}

export interface JourneyEntry {
  kind: string
  title: string
  context: string
  when: string
  description: string
  href?: string
}
