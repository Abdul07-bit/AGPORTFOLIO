// Admin API used by the /admin page.
//   POST   /api/admin/login     { email, password } → sets the session cookie
//   POST   /api/admin/logout
//   GET    /api/admin/session   → { email }
//   PUT    /api/admin/settings  { projects, social } → saved settings
//   PUT    /api/admin/resume    { data: <PDF as base64> } → saved settings
//   DELETE /api/admin/resume    → back to the bundled resume
import { createHash } from 'node:crypto'
import type { Config, Context } from '@netlify/functions'
import { LIMITS, sanitizeSettings } from '../../src/data/settings.ts'
import { adminConfig, clearedSessionCookie, readSession, safeEqual, sessionCookie, verifyPassword, type AdminConfig } from '../lib/auth.ts'
import {
  clearLoginFailures,
  deleteResume,
  loginRetryAfter,
  projectSlugs,
  readSettings,
  recordLoginFailure,
  writeResume,
  writeSettings,
} from '../lib/store.ts'

const noStore = { 'cache-control': 'no-store' }
const error = (status: number, message: string, headers: Record<string, string> = {}) =>
  Response.json({ error: message }, { status, headers: { ...noStore, ...headers } })
const ok = (body: unknown, headers: Record<string, string> = {}) => Response.json(body, { headers: { ...noStore, ...headers } })

export default async (request: Request, context: Context) => {
  const admin = adminConfig()
  if (!admin) return error(503, 'The admin panel is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET.')

  const url = new URL(request.url)
  const route = `${request.method} ${url.pathname.replace(/^\/api\/admin/, '').replace(/\/$/, '')}`
  const secure = url.protocol === 'https:'

  // Cross-site requests never carry the SameSite=Strict cookie; refusing a
  // foreign Origin outright also covers login.
  const origin = request.headers.get('origin')
  if (request.method !== 'GET' && origin && origin !== url.origin) return error(403, 'Cross-origin request refused.')

  if (route === 'POST /login') return login(request, context, admin, secure)
  if (route === 'POST /logout') return ok({ ok: true }, { 'set-cookie': clearedSessionCookie(secure) })

  const email = readSession(request, admin)
  if (!email) return error(401, 'Your session has expired. Sign in again.')

  switch (route) {
    case 'GET /session':
      return ok({ email })

    case 'PUT /settings': {
      const body = await request.json().catch(() => null)
      const input = sanitizeSettings(body, projectSlugs)
      if (body?.projects && !input.projects) return error(400, 'Keep at least one project visible.')
      const current = await readSettings()
      return ok(await writeSettings({ ...current, projects: input.projects, social: input.social }))
    }

    case 'PUT /resume': {
      // Sent as base64 in JSON: raw binary bodies are not reliable in local emulation.
      const body = (await request.json().catch(() => null)) as { data?: unknown } | null
      if (typeof body?.data !== 'string') return error(400, 'Upload a PDF file.')
      const data = Buffer.from(body.data, 'base64')
      if (data.byteLength > LIMITS.resumeBytes) return error(413, `The PDF must be ${LIMITS.resumeBytes / 1024 / 1024} MB or smaller.`)
      if (data.subarray(0, 5).toString('latin1') !== '%PDF-') return error(400, 'That file is not a valid PDF.')
      await writeResume(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer)
      const current = await readSettings()
      return ok(await writeSettings({ ...current, resume: { updatedAt: new Date().toISOString(), size: data.byteLength } }))
    }

    case 'DELETE /resume': {
      await deleteResume()
      const current = await readSettings()
      return ok(await writeSettings({ ...current, resume: null }))
    }

    default:
      return error(404, 'Not found.')
  }
}

async function login(request: Request, context: Context, admin: AdminConfig, secure: boolean) {
  const clientKey = `login-${createHash('sha256').update(context.ip ?? 'unknown').digest('hex').slice(0, 32)}`
  const retryAfter = await loginRetryAfter(clientKey)
  if (retryAfter > 0) {
    const minutes = Math.ceil(retryAfter / 60000)
    return error(429, `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`, {
      'retry-after': String(Math.ceil(retryAfter / 1000)),
    })
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown; password?: unknown } | null
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  // Always run the hash so a wrong email takes as long as a wrong password.
  const passwordOk = await verifyPassword(password, admin.passwordHash)
  if (!passwordOk || !safeEqual(email, admin.email)) {
    await recordLoginFailure(clientKey)
    return error(401, 'Incorrect email or password.')
  }

  await clearLoginFailures(clientKey)
  return ok({ email: admin.email }, { 'set-cookie': sessionCookie(admin, secure) })
}

export const config: Config = {
  path: '/api/admin/*',
}
