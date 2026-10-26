// Persistent storage for the admin panel, backed by Netlify Blobs.
import { getStore } from '@netlify/blobs'
import { projects } from '../../src/data/projects.ts'
import { emptySettings, sanitizeSettings, type SiteSettings } from '../../src/data/settings.ts'

const SETTINGS_KEY = 'settings'
const RESUME_KEY = 'resume'

// Strong consistency so a page reload right after saving shows the change.
const content = () => getStore({ name: 'portfolio', consistency: 'strong' })
const auth = () => getStore({ name: 'admin-auth', consistency: 'strong' })

export const projectSlugs = projects.map((project) => project.slug)

export async function readSettings(): Promise<SiteSettings> {
  const stored = await content().get(SETTINGS_KEY, { type: 'json' })
  return stored ? sanitizeSettings(stored, projectSlugs) : emptySettings
}

export async function writeSettings(settings: SiteSettings): Promise<SiteSettings> {
  const next = { ...settings, updatedAt: new Date().toISOString() }
  await content().setJSON(SETTINGS_KEY, next)
  return next
}

export const readResume = () => content().get(RESUME_KEY, { type: 'arrayBuffer' })
export const writeResume = (data: ArrayBuffer) => content().set(RESUME_KEY, data)
export const deleteResume = () => content().delete(RESUME_KEY)

// ─── Login throttling ─────────────────────────────────────────────────────

const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000

interface Attempts {
  failures: number
  resetAt: number
}

/** Milliseconds until this client may try again, or 0. */
export async function loginRetryAfter(clientKey: string) {
  const attempts = (await auth().get(clientKey, { type: 'json' })) as Attempts | null
  if (!attempts || attempts.resetAt < Date.now()) return 0
  return attempts.failures >= MAX_FAILURES ? attempts.resetAt - Date.now() : 0
}

export async function recordLoginFailure(clientKey: string) {
  const current = (await auth().get(clientKey, { type: 'json' })) as Attempts | null
  const attempts = current && current.resetAt > Date.now() ? current : { failures: 0, resetAt: Date.now() + WINDOW_MS }
  await auth().setJSON(clientKey, { ...attempts, failures: attempts.failures + 1 })
}

export const clearLoginFailures = (clientKey: string) => auth().delete(clientKey)
