// Applies the settings saved from the admin panel to the static content
// before the app first renders. Components keep importing `profile` and
// `projects` directly; this mutates them in place once, at startup.
import { journey } from '../data/content'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { sanitizeSettings, type SiteSettings } from '../data/settings'
import { skillCategories } from '../data/skills'

export const SETTINGS_ENDPOINT = '/api/settings'
export const RESUME_ENDPOINT = '/api/resume'

/** Where the resume download points. An uploaded resume replaces the bundled one. */
export const resumeLink = { href: profile.resume.path, available: __RESUME_AVAILABLE__ }

export const knownProjectSlugs = projects.map((project) => project.slug)

export async function fetchSiteSettings(timeoutMs?: number): Promise<SiteSettings | null> {
  const response = await fetch(SETTINGS_ENDPOINT, {
    headers: { accept: 'application/json' },
    cache: 'no-store',
    signal: timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined,
  })
  // Without the Netlify functions (e.g. `vite preview`) this path serves index.html.
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return null
  return sanitizeSettings(await response.json(), knownProjectSlugs)
}

/** Never blocks the first render for long, and falls back to the defaults on any failure. */
export async function loadSiteSettings(timeoutMs = 1500) {
  try {
    const settings = await fetchSiteSettings(timeoutMs)
    if (settings) applySiteSettings(settings)
  } catch {
    // offline, slow or not deployed on Netlify — keep the defaults
  }
}

function applySiteSettings(settings: SiteSettings) {
  if (settings.social) {
    profile.social.splice(0, profile.social.length, ...settings.social)
  }

  if (settings.resume) {
    resumeLink.href = `${RESUME_ENDPOINT}?v=${encodeURIComponent(settings.resume.updatedAt)}`
    resumeLink.available = true
  }

  if (settings.projects) {
    const { order, hidden } = settings.projects
    // Projects added to projects.ts after the order was saved go to the end.
    const ordered = [...order, ...knownProjectSlugs.filter((slug) => !order.includes(slug))]
    const visible = ordered.flatMap((slug) => {
      const project = projects.find((item) => item.slug === slug)
      return project && !hidden.includes(slug) ? [project] : []
    })
    if (visible.length === 0) return

    projects.splice(0, projects.length, ...visible)
    visible.forEach((project, index) => {
      project.index = String(index + 1).padStart(2, '0')
    })

    // Hidden case studies 404, so drop every link that points at one.
    const shown = new Set(visible.map((project) => project.slug))
    for (const group of skillCategories) {
      for (const skill of group.skills) {
        if (!skill.related) continue
        const related = skill.related.filter((slug) => shown.has(slug))
        skill.related = related.length ? related : undefined
      }
    }
    for (const entry of journey) {
      if (entry.href?.startsWith('/work/') && !shown.has(entry.href.slice('/work/'.length))) delete entry.href
    }
  }
}
