// Settings edited from the admin panel (/admin) and stored by the Netlify
// functions in netlify/. They override the defaults in profile.ts and
// projects.ts at runtime. Shared by the browser and the server, so this file
// stays free of runtime imports; both sides run every payload through
// `sanitizeSettings` before using it.

export interface SocialLinkSetting {
  id: string
  label: string
  href: string
}

export interface SiteSettings {
  /** Project order and visibility. null = order and visibility from projects.ts. */
  projects: { order: string[]; hidden: string[] } | null
  /** Profile links, in display order. null = the links in profile.ts. */
  social: SocialLinkSetting[] | null
  /** Set when a resume has been uploaded; null = the bundled public/resume.pdf. */
  resume: { updatedAt: string; size: number } | null
  updatedAt: string | null
}

export const emptySettings: SiteSettings = { projects: null, social: null, resume: null, updatedAt: null }

export const LIMITS = {
  socialLinks: 12,
  label: 40,
  url: 300,
  /** Netlify functions accept request bodies up to 6 MB, and the upload is base64 (+33%). */
  resumeBytes: 4 * 1024 * 1024,
} as const

/** Suggested rows in the admin panel. The id is only used as a stable key. */
export const socialPresets = [
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/…' },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/…' },
  { id: 'leetcode', label: 'LeetCode', placeholder: 'https://leetcode.com/u/…' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/…' },
] as const

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

/** Accepts only absolute http(s) URLs, so a stored link can never become `javascript:`. */
export function normaliseUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > LIMITS.url) return null
  try {
    const url = new URL(trimmed)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

const slugList = (value: unknown, known: ReadonlySet<string>) =>
  Array.isArray(value) ? [...new Set(value.filter((slug): slug is string => typeof slug === 'string' && known.has(slug)))] : []

const toId = (label: string, index: number) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || `link-${index + 1}`

/**
 * Validates untrusted settings. Unknown project slugs, malformed links and
 * extra fields are dropped. `knownSlugs` is the set of slugs in projects.ts.
 */
export function sanitizeSettings(input: unknown, knownSlugs: readonly string[]): SiteSettings {
  if (!isRecord(input)) return emptySettings
  const known = new Set(knownSlugs)

  let projects: SiteSettings['projects'] = null
  if (isRecord(input.projects)) {
    const order = slugList(input.projects.order, known)
    const hidden = slugList(input.projects.hidden, known)
    // At least one project must stay visible: the gallery has nothing to show otherwise.
    if (knownSlugs.some((slug) => !hidden.includes(slug))) projects = { order, hidden }
  }

  let social: SiteSettings['social'] = null
  if (Array.isArray(input.social)) {
    const ids = new Set<string>()
    social = input.social
      .filter(isRecord)
      .flatMap((link, index) => {
        const label = typeof link.label === 'string' ? link.label.trim().slice(0, LIMITS.label) : ''
        const href = normaliseUrl(link.href)
        if (!label || !href) return []
        let id = typeof link.id === 'string' && /^[a-z0-9-]{1,40}$/.test(link.id) ? link.id : toId(label, index)
        while (ids.has(id)) id = `${id}-${index + 1}`
        ids.add(id)
        return [{ id, label, href }]
      })
      .slice(0, LIMITS.socialLinks)
  }

  let resume: SiteSettings['resume'] = null
  if (isRecord(input.resume) && typeof input.resume.updatedAt === 'string' && typeof input.resume.size === 'number') {
    resume = { updatedAt: input.resume.updatedAt, size: input.resume.size }
  }

  return { projects, social, resume, updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null }
}
