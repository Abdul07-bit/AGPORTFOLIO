// Admin authentication for the Netlify functions.
//
// Credentials never ship to the browser: the email and an scrypt hash of the
// password live in environment variables (generate them with
// `npm run admin:credentials`). A successful login sets a signed, HttpOnly
// session cookie that only the /api/admin endpoints receive.
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from 'node:crypto'

const scrypt = (password: string, salt: Buffer, keylen: number, options: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) =>
    scryptCallback(password, salt, keylen, options, (error, key) => (error ? reject(error) : resolve(key))),
  )

const COOKIE = 'ag_admin'
const SESSION_SECONDS = 8 * 60 * 60

export interface AdminConfig {
  email: string
  passwordHash: string
  secret: string
}

/** null when the admin environment variables are missing or too weak. */
export function adminConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!email || !passwordHash?.startsWith('scrypt:') || !secret || secret.length < 32) return null
  return { email, passwordHash, secret }
}

// ─── Passwords ────────────────────────────────────────────────────────────
// Format: scrypt:<N>:<r>:<p>:<salt base64url>:<hash base64url>

export async function hashPassword(password: string) {
  const [N, r, p] = [16384, 8, 1]
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, 64, { N, r, p })
  return `scrypt:${N}:${r}:${p}:${salt.toString('base64url')}:${hash.toString('base64url')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, N, r, p, salt, hash] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const expected = Buffer.from(hash, 'base64url')
  try {
    const actual = await scrypt(password, Buffer.from(salt, 'base64url'), expected.length, { N: Number(N), r: Number(r), p: Number(p) })
    return timingSafeEqual(actual, expected)
  } catch {
    return false // malformed hash parameters
  }
}

/** Compares strings without leaking where they differ. */
export const safeEqual = (a: string, b: string) => {
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(a), digest(b))
}

// ─── Sessions ─────────────────────────────────────────────────────────────

// Keyed on the password hash too, so changing the password signs everyone out.
const sign = (payload: string, config: AdminConfig) =>
  createHmac('sha256', `${config.secret}:${config.passwordHash}`).update(payload).digest('base64url')

export function sessionCookie(config: AdminConfig, secure: boolean) {
  const payload = Buffer.from(JSON.stringify({ sub: config.email, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url')
  return cookie(`${payload}.${sign(payload, config)}`, SESSION_SECONDS, secure)
}

export const clearedSessionCookie = (secure: boolean) => cookie('', 0, secure)

const cookie = (value: string, maxAge: number, secure: boolean) =>
  [`${COOKIE}=${value}`, 'Path=/api/admin', `Max-Age=${maxAge}`, 'HttpOnly', 'SameSite=Strict', secure ? 'Secure' : '']
    .filter(Boolean)
    .join('; ')

/** The signed-in admin email, or null. */
export function readSession(request: Request, config: AdminConfig): string | null {
  const token = request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  const [payload, signature] = token?.split('.') ?? []
  if (!payload || !signature || !safeEqual(signature, sign(payload, config))) return null
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { sub?: unknown; exp?: unknown }
    if (session.sub !== config.email || typeof session.exp !== 'number' || session.exp * 1000 < Date.now()) return null
    return config.email
  } catch {
    return null
  }
}
